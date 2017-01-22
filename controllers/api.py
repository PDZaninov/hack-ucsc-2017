import logging


def get_posts():
    posts = []
    rows = db().select(db.post.ALL, orderby=~db.post.created_on)

    for i, r in enumerate(rows):
        image = URL('appadmin', 'download/db', args=r.image)
        loc = dict(lat=r.lat, lng=r.lng)
        uname = db(db.auth_user.id == r.user_id).select(db.auth_user.first_name, db.auth_user.last_name).first()
        author = uname.first_name + " " + uname.last_name

        post = dict(
            id=r.id,
            name=r.title,
            desc=r.description,
            img=image,
            loc=loc,
            point=r.point,
            time=r.created_on,
            author=author,
            comment=dict()
        )
        posts.append(post)

    return response.json(dict(posts=posts))


def create_comment():
    db.feedbacks.insert(recv_id=request.vars.r_id, user_id=request.vars.u_id, post_id=request.vars.p_id,
                        retort=request.vars.content)


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


def comment_response(f, sender, receiver):
    return dict(
        id=f.post_id,
        content=f.retort,
        time=f.created_on,
        sender=sender,
        receiver=receiver
    )
def create_post(post):

    db.posts.bulk_insert([{'title':post.name},
                                     {'description': post.desc},
                                     {'image': post.img},
                                     {'lat': post.loc.lat},
                                     {'lng': post.loc.lng},
                                     {'point': 0}])
    return dict()
