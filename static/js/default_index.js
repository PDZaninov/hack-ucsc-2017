/**
 * Created by jarrett on 1/21/17.
 */

function extend(a, b) {
    for (var i = 0; i < b.length; i++) {
        a.push(b[i]);
    }
};

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
                    img: ''
                },
                {
                    name: 'asdf',
                    desc: 'desc',
                    loc: {lat: 36.9585966, lng: -122.060937},
                    time: 'time',
                    img: ''
                }
            ],
            sel_post: -1,
            is_create_post: false,
            is_loading: false,
            new_post: {
                name: '',
                desc: ''
            }
        },
        methods: {
            // get all posts TODO API
            getPosts: function () {
                $.getJSON(get_posts_url, function(data) {
                    main_content.posts = [];
                    extend(main_content.posts, data.posts);
                });
            },

            // create a new post TODO API
            //implement loading for geolocation and api call
            createPost: function () {
                var n = this.new_post;
                var np = {
                    name: n.name, desc: n.desc
                };

                // geolocation loading...
                this.toggleLoading();
                navigator.geolocation.getCurrentPosition(function (pos) {
                    n = {
                        name: np.name,
                        desc: np.desc,
                        loc: {lat: pos.coords.latitude, lng: pos.coords.longitude},
                        time: '...',
                        img: ''
                    };
                    main_content.posts.push(n);
                    main_content.toggleLoading();

                    // api call loading...
                    main_content.toggleLoading();
                    $.post(create_post_url,
                        {post: n},
                        function (data) {
                            posts[posts.length - 1].time = data.time;
                            main_content.toggleLoading();
                        });
                });

                this.resetAll();
            },

            // mark a post as complete. delete it. TODO API
            markPostComplete: function () {

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
            toggleLoading: function () {
                this.is_loading = !this.is_loading;
            },
            resetAll: function () {
                this.is_create_post = false;
                this.new_post.desc = '';
                this.new_post.name = '';
                this.sel_post = -1;
            }
        }
});