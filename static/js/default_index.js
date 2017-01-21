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
                    desc: 'desc',
                    loc: {lat: 36.9741, lng: -122.0308},
                    time: 'time',
                    img: '',
                },
                {
                    name: 'asdf',
                    desc: 'desc',
                    loc: {lat: 36.9585966, lng: -122.060937},
                    time: 'time',
                    img: '',
                }
            ],
            sel_post: -1,
            is_create_post: false,
            new_post: {
                name: '',
                desc: '',

            }
        },
        methods: {
            // get all posts TODO API
            getPosts: function () {
                $.posts(get_classes_url,
                    {}, function (data) {
                        main_content.posts = [];
                        extend(main_content.posts, data.posts);
                    }
                );
            },
            // create a new post TODO API
            createPost: function () {
                var n = this.new_post;
                var np = {
                    name: n.name, desc: n.desc
                };
                navigator.geolocation.getCurrentPosition(function (pos) {
                    main_content.posts.push({
                        name: np.name,
                        desc: np.desc,
                        loc: {lat: pos.coords.latitude, lng: pos.coords.longitude},
                        time: 'time',
                        img: '',
                    });
                });
                this.resetAll();
            },
            // select post if new idx
            // otherwise deselect post
            selectPost: function (idx) {
                if (this.sel_post != idx) {
                    this.sel_post = idx;
                    var loc = this.posts[idx].loc;
                    var evt = jQuery.Event("selected_loc", {location: {lat: loc.lat, lng: loc.lng}});
                    $('#post_list').trigger(evt);
                } else {
                    this.sel_post = -1;
                    var evt = jQuery.Event("deselected_loc");
                    $('#post_list').trigger(evt);
                }
            },
            toggleCreatePost: function () {
                this.is_create_post = !this.is_create_post;
            },
            resetAll: function () {
                this.is_create_post = false;
                this.new_post.desc = '';
                this.new_post.name = '';
                this.sel_post = -1;
            }
        }
    })
    ;