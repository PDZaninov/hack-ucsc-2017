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
        is_create_post: false,
        new_post_data: {
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
        // select post if new idx
        // otherwise deselect post
        selectPost: function (idx) {
            if (sel_post != idx)
                this.sel_post = idx;
            else
                this.sel_post = -1;
        },
        toggleCreatePost: function () {
            this.is_create_post = !this.is_create_post;
        }
    }
});