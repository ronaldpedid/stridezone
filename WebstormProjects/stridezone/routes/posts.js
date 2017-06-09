const express = require('express');
const router = express.Router();
const Post = require('../lib/models/Post.js');
const mongoose = require('mongoose');


// START NEW CRUD //
// GET /events
// "Show all events"
router.get('/', function (req,res) {
    Post.find(function (err, post) {
        if (err) {
            throw err;
        }
        res.render('posts/posts', {post: post});
    });
});

// GET /events/create
// "Show page to create new event"
router.get('/create', function (req, res) {
    var post = new Post();
    res.render('posts/edit', {
        posts: post
    });
});

// GET /events/:id
// "Show a single event"
router.get('/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            throw err;
        }
        res.render('posts/post',
            {post: post}
        );
    });
});

// POST /events
// "Form post to create event"
router.post('/', function (req, res) {
    console.log(req.body);
    Post.create(req.body, function (err, post) {
        if (err) {
            throw err;
        }
        req.flash("success", "Successfully posted!");
        res.redirect('/posts/' );
    });
});

// GET /events/:id/edit
// "Show page to edit an event"
router.get('/:id/edit', function (req, res) {
    Post.findById(req.params.id, function(err, post){
        if (err) {
            throw err;
        }
        res.render('posts/edit', {
            action: '/posts/' + post.id + '?_method=PUT',
            post: post,
            deleteAction: '/posts/' + post.id + '?_method=DELETE'
        });
    });
});
// PUT/PATCH /events/:id
// "Update server with changes"
router.put('/:id', function (req, res) {
    console.log(req.body);
    Post.findOneAndUpdate({_id: req.params.id}, req.body,
        function (err, post) {
            if (err) {
                throw err;
            }
            res.redirect('/posts/' + post.id)
        });
});

// DELETE /events/:id
// "Delete the record"
router.delete('/:id', function (req, res) {
    Post.findByIdAndRemove({_id: req.params.id}, function (err) {
        if (err) {
            throw err;
        }
        res.redirect('/posts/');
    });
});

module.exports = router;