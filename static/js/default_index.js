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
        // get all posts
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
            var np = this.new_post;
            this.posts.push({name: np.name, desc: np.desc});
            this.resetAll();
        },
        // select post if new idx
        // otherwise deselect post
        selectPost: function (idx) {
            if (this.sel_post != idx) {
                this.sel_post = idx;
                var loc = this.posts[idx].loc;
                var evt = jQuery.Event( "selected_location", {location:{lat:loc.lat, lng:loc.lng, zoom:17}} );
                $('#post_list').trigger(evt);
            } else
                this.sel_post = -1;
        },
        toggleCreatePost: function () {
            this.is_create_post = !this.is_create_post;
        },
        resetAll: function () {
            this.is_create_post = false;
            this.sel_post = -1;
        }
    }
});