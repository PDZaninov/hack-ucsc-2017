import logging

def get_posts():
    posts = []
    rows = db().select(db.post.ALL, orderby=~db.post.created_on)



    for i, r in enumerate(rows):
        image = URL('appadmin', 'download/db', args=r.image)
        loc = dict(lat=r.lat, lng=r.lng)
        uname = db(db.auth_user.id ==r.user_id).select(db.auth_user.first_name, db.auth_user.last_name).first()
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

def create_post(post):

    db.posts.bulk_insert([{'title':post.name},
                                     {'description': post.desc},
                                     {'image': post.img},
                                     {'lat': post.loc.lat},
                                     {'lng': post.loc.lng},
                                     {'point': 0}])
    return dict()
