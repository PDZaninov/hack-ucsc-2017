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
            posts: [],
            sel_post: -1,
            show_comments: false,
            is_create_post: false,
            is_create_comment: false,
            is_uploading: false,
            uploading: 0,
            loading_comments: 0,
            commenting: 0,
            new_post: {
                name: '',
                desc: '',
                img: '',
                imgName: '',
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
                try {
                    $.post(get_comments_post_url,
                        {id: main_content.posts[idx].id},
                        function (data) {
                            main_content.posts[idx].comments = [];
                            extend(main_content.posts[idx].comments, data.comments);
                            main_content.incLoadingComments();
                        }
                    );
                }
                catch (error) {
                    console.error(error);
                    main_content.resetLoadingComments();
                }
            }
            ,

            // create a new post TODO API
            //implement loading for geolocation and api call
            createPost: function () {
                var n = this.new_post;
                var np = {
                    name: n.name,
                    desc: n.desc,
                    img: n.img,
                    imgName: n.imgName
                };
                this.resetUploading();
                // geolocation loading...
                this.incUploading();
                try {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        n = {
                            id: 0,
                            name: np.name,
                            desc: np.desc,
                            loc: {lat: pos.coords.latitude, lng: pos.coords.longitude},
                            img: np.img,
                            point: 0,
                            comments: [],
                            author: '',
                            created_on: '',
                            imgName: np.imgName,
                        };
                        main_content.incUploading();

                        // api call loading...
                        try {
                            $.post(create_post_url,
                                {
                                    name: n.name,
                                    desc: n.desc,
                                    lat: n.loc['lat'],
                                    lng: n.loc['lng'],
                                    imgName: n.imgName,
                                    img: n.img,
                                    point: n.point,
                                    comment: n.comments,
                                    author: ''
                                },
                                function (data) {
                                    n.author = data.author;
                                    n.created_on = data.created_on;
                                    n.id = data.id;
                                    main_content.posts.unshift(n)
                                    main_content.incUploading();
                                }
                            );
                        } catch (error) {
                            console.error(error);
                            main_content.resetUploading();
                        }
                    });
                }
                catch (error) {
                    console.error(error);
                    main_content.resetUploading();
                }
                this.resetAll();
            }
            ,

            createComment: function () {
                var p = this.posts[this.sel_post];
                this.resetCommenting();
                this.incCommenting();
                try {
                    $.post(create_comment_url,
                        {
                            r_id: main_content.posts[main_content.sel_post].u_id,
                            p_id: main_content.posts[main_content.sel_post].id,
                            retort: main_content.new_comment
                        }, function (data) {
                            main_content.posts[main_content.sel_post].comments.unshift(data.comment)
                            main_content.incCommenting();
                        }
                    );
                } catch (error) {
                    console.error(error);
                    main_content.resetCommenting();
                }
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
                if (this.is_create_post) {
                    setTimeout(function () {
                        $("#post_image").change(function () {
                            var fileObj = this,
                                file;

                            if (fileObj.files) {
                                file = fileObj.files[0];
                                main_content.new_post.imgName = file.name;
                                var fr = new FileReader;
                                fr.onloadend = changeimg;
                                fr.readAsDataURL(file)
                            } else {
                                file = fileObj.value;
                                changeimg(file);
                            }
                        });

                        function changeimg(str) {
                            if (typeof str === "object") {
                                str = str.target.result; // file reader
                            }
                            main_content.new_post.img = str;
                        }
                    }, 500); //http://jsfiddle.net/fKQDL/
                }
            },
            toggleCreateComment: function () {
                this.is_create_comment = !this.is_create_comment;
            }
            ,
            toggleComments: function () {
                this.show_comments = !this.show_comments;
            },
            incUploading: function () {
                console.log(this.uploading);
                if (this.uploading > 3) {
                    this.resetUploading();
                    console.error('uploading multiple posts concurrently');
                }
                this.uploading++;
                this.is_uploading = true;
                if (this.uploading == 3)
                    this.is_uploading = false;
            }
            ,
            incLoadingComments: function () {
                if (this.loadingComments > 2)
                    console.error('loading multiple comments');
                this.loadingComments++;
            }
            ,
            resetUploading: function () {
                this.is_uploading = false;
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