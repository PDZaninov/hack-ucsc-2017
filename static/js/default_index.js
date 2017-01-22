/**
 * Created by jarrett on 1/21/17.
 */

function extend(a, b) {
    for (var i = 0; i < b.length; i++) {
        a.push(b[i]);
    }
}

var main_content = new Vue({
        el: "#main_content",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            posts: [
                {
                    name: 'name',
                    author: 'guy',
                    desc: 'desc',
                    loc: {lat: 36.9741, lng: -122.0308},
                    time: 'time',
                    point: 12,
                    img: '',
                    comments: [],
                    id: 1,
                    img: ''
                },
                {
                    name: 'asdf',
                    author: 'guy2',
                    desc: 'desc',
                    loc: {lat: 36.9585966, lng: -122.060937},
                    time: 'time',
                    point: 14,
                    img: '',
                    comments: [],
                    id: 2,
                }
            ],
            sel_post: -1,
            show_comments: false,
            is_create_post: false,
            is_create_comment: false,
            uploading: 0,
            loading_comments: 0,
            commenting: 0,
            new_post: {
                name: '',
                desc: '',
            },
            new_comment: '',
        },
        methods: {
            // get all posts TODO API
            getPosts: function () {
                $.getJSON(get_posts_url, function (data) {
                    main_content.posts = [];
                    extend(main_content.posts, data.posts);
                });
            }
            ,

            // get all comments for this post TODO API
            getComments: function (idx) {
                this.toggleComments();
                this.resetLoadingComments();
                this.incLoadingComments();
                $.post(get_comments_post_url,
                    {id: main_content.posts[idx].id},
                    function (data) {
                        extend(main_content.posts[idx].comments, data.comments);
                        main_content.incLoadingComments();
                    }
                );
            }
            ,

            // create a new post TODO API
            //implement loading for geolocation and api call
            createPost: function () {
                var n = this.new_post;
                var np = {
                    name: n.name, desc: n.desc
                };

                this.resetUploading();
                // geolocation loading...
                this.incUploading();
                //try {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    n = {
                        name: np.name,
                        desc: np.desc,
                        loc: {lat: pos.coords.latitude, lng: pos.coords.longitude},
                        time: '...',
                        img: '',
                        point: 0,
                        comments: [],
                        author: '',
                        time: '',
                        img: ''
                    };
                    main_content.posts.push(n);
                    main_content.incUploading();

                    // api call loading...
                    main_content.incUploading();
                    //try {
                    $.post(create_post_url,
                        {post: n},
                        function (data) {
                            posts[posts.length - 1].time = data.time;
                            main_content.incUploading();
                        }
                    );
                    /*} catch (error) {
                     console.error(error);
                     main_content.resetUploading();
                     }*/
                });
                /*}
                 catch (error) {
                 console.error(error);
                 main_content.resetUploading();
                 }*/
                this.resetAll();
            }
            ,

            createComment: function () {
                var p = this.posts[this.sel_post];
                this.resetCommenting();
                this.incCommenting();
                //try {
                $.post(create_comment_url,
                    {
                        r_id: p.u_id,
                        p_id: p.id,
                        retort: main_content.new_comment
                    }, function (data) {
                        p.comments.unshift(data.comment)
                        main_content.incCommenting();
                    }
                );
                /*} catch (error) {
                 console.error(error);
                 main_content.resetCommenting();
                 p.comments.slice(p.comments.indexOf(c), 1);
                 }*/
            },

            // select post if new idx
            // otherwise deselect post
            selectPost: function (idx) {
                if (this.sel_post != idx) {
                    this.sel_post = idx;
                    var loc = this.posts[idx].loc;
                    var evt = jQuery.Event("selected_loc", {location: {lat: loc.lat, lng: loc.lng}});
                    $('#main_content').trigger(evt);
                } else {
                    this.sel_post = -1;
                    var evt = jQuery.Event("deselected_loc");
                    $('#main_content').trigger(evt);
                }
            }
            ,

            incCommenting: function () {
                if (this.commenting > 2)
                    console.error('uploading multiple comments concurrently')
                this.commenting++;
            },
            resetCommenting: function () {
                this.commenting = 0;
            },
            toggleCreatePost: function () {
                this.is_create_post = !this.is_create_post;
            },
            toggleCreateComment: function () {
                this.is_create_comment = !this.is_create_comment;
            }
            ,
            toggleComments: function () {
                this.show_comments = !this.show_comments;
            },
            incUploading: function () {
                if (this.uploading > 5)
                    console.error('uploading multiple posts concurrently');
                this.uploading++;
            }
            ,
            incLoadingComments: function () {
                if (this.loadingComments > 2)
                    console.error('loading multiple comments');
                this.loadingComments++;
            }
            ,
            resetUploading: function () {
                this.uploading = 0;
            }
            ,
            resetLoadingComments: function () {
                this.loadingComments = 0;
            }
            ,
            resetAll: function () {
                this.is_create_post = false;
                this.new_post.desc = '';
                this.new_post.name = '';
                this.sel_post = -1;
            }
        }
    })
    ;