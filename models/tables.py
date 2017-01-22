
import datetime

db.define_table('post',
                Field('user_id', 'reference auth_user', default=session.auth.user.id if session.auth else None),
                Field('title', 'string'),
                Field('description', 'string'),
                Field('image', 'upload', uploadfield='image_file'),
                Field('image_file', 'blob'),
                Field('address', 'string'),
                Field('lat', 'double'),
                Field('lng', 'double'),
                Field('point', 'integer'),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow())
            )

db.define_table('feedback',
                Field('recv_id', 'reference auth_user'),
                Field('user_id', 'reference auth_user'),
                Field('post_id', 'reference post'),
                Field('retort', 'string'),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow())
                )

db.post.user_id.readable = db.post.user_id.writable = False
db.post.lat.readable = db.post.lat.writable = False
db.post.lng.readable = db.post.lat.writable = False
db.post.created_on.readable = db.post.created_on.writable = False

db.post.title.requires = IS_NOT_EMPTY()