const mongoose = require('mongoose');
const Post = require('../models/Post');

module.exports = {
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts', { posts });
    },
    postNew(req, res, next) {
        res.render('posts/new');
    },
    createPost(req, res, next) {
        const newPost = {
            title: req.body.title,
            body: req.body.body,
            image: req.body.image
        }

        new Post(newPost)
            .save()
            .then(post => {
                res.redirect('/posts');
            });
    }
}