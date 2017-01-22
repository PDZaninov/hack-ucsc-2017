import logging


def get_posts():
    posts = []
    post_rows = db(db.post).select( orderby=~db.post.created_on)

    for i, p in enumerate(post_rows):
        image = URL('appadmin', 'download/db', args=p.image)
        loc = dict(lat=p.lat, lng=p.lng)
        uname = db(db.auth_user.id == p.user_id).select(db.auth_user.first_name, db.auth_user.last_name).first()
        author = uname.first_name + " " + uname.last_name

        post = post_response(p, image, loc, author)
        posts.append(post)

    return response.json(dict(posts=posts))

# get posts of the requested user
def get_posts_user():
    posts = []
    post_rows = db(db.post.user_id == request.vars.id).select(orderby=~db.post.created_on)

    for i, p in enumerate(post_rows):
        image = URL('appadmin', 'download/db', args=p.image)
        loc = dict(lat=p.lat, lng=p.lng)
        uname = db(db.auth_user.id == p.user_id).select(db.auth_user.first_name, db.auth_user.last_name).first()
        author = uname.first_name + " " + uname.last_name

        post = post_response(p, image, loc, author)
        posts.append(post)

    return response.json(dict(posts=posts))

# insert comment into feedbacks table
def create_comment():
    id = db.feedback.insert(recv_id=request.vars.r_id, user_id=auth.user_id, post_id=request.vars.p_id,
                        retort=request.vars.retort)
    f = db.feedback[id]
    user = db.auth_user[f.recv_id]
    receiver = user.first_name + ' ' + user.last_name
    sender = auth.user.first_name + ' ' + auth.user.last_name
    return response.json(dict(comment=comment_response(f,sender,receiver)))


# send all comments sent by a user
def get_comments_sent_user():
    comments = []
    feedbacks = db(db.feedback.user_id == request.vars.id).select(orderby=~db.feedback.created_on)

    user = db.auth_user[feedbacks[0].user_id]
    sender = user.first_name + ' ' + user.last_name
    for i, f in enumerate(feedbacks):
        user = db.auth_user[f.user_id]
        receiver = user.first_name + ' ' + user.last_name

        feedback = comment_response(f, sender, receiver)
        comments.append(feedback)

    return response.json(dict(comments=comments))


# send all comments received by a user
def get_comments_recv_user():
    comments = []
    feedbacks = db(db.feedback.recv_id == request.vars.id).select(orderby=~db.feedback.created_on)

    user = db.auth_user[feedbacks[0].recv_id]
    receiver = user.first_name + ' ' + user.last_name
    for i, f in enumerate(feedbacks):
        user = db.auth_user[f.user_id]
        sender = user.first_name + ' ' + user.last_name

        feedback = comment_response(f, sender, receiver)
        comments.append(feedback)

    return response.json(dict(comments=comments))


# send all comments linked to a post
def get_comments_post():
    comments = []
    feedbacks = db(db.feedback.post_id == request.vars.id).select(orderby=~db.feedback.created_on)

    for i, f in enumerate(feedbacks):
        user = db.auth_user[f.user_id]
        sender = user.first_name + ' ' + user.last_name
        user = db.auth_user[f.recv_id]
        receiver = user.first_name + ' ' + user.last_name

        feedback = comment_response(f, sender, receiver)
        comments.append(feedback)

    return response.json(dict(comments=comments))

# helper function for comment response
def comment_response(f, sender, receiver):
    return dict(
        id=f.post_id,
        content=f.retort,
        time=f.created_on,
        sender=sender,
        receiver=receiver
    )
# helper function for post response
def post_response(p, image, loc, author):
    return dict(
        id=p.id,
        u_id=p.user_id,
        name=p.title,
        desc=p.description,
        img=image,
        loc=loc,
        point=p.point,
        time=p.created_on,
        author=author,
        comments=[]
    )

def create_post(post):

    db.posts.bulk_insert([{'title':post.name},
                                     {'description': post.desc},
                                     {'image': post.img},
                                     {'lat': post.loc.lat},
                                     {'lng': post.loc.lng},
                                     {'point': 0}])
    return dict()
