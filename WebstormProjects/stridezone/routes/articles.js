const express = require('express');
const router = express.Router();
const Article = require('../lib/models/Article.js');
const mongoose = require('mongoose');

//show articles index
router.get('/', function (req, res, next) {
    var decks = ["meta deck", "scrub deck"];
    var message = "A new message!";
    res.render('articles/index', {
        message: message,
        img: "There should be an img here.",
        decks: decks

    });
});
//show page to create a new article post
router.get('/create', function (req, res, next) {
    var article = new Article();
    res.render('articles/edit', {
        articles: article,
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;

    
});

//show a specific article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            throw err;
        }
        res.render('articles/article',
            {article: article}
        );
    });
});


//Form post to create a new article
router.post('/', function (req, res, next) {
    console.log(req.body);

    //validate input data

    Article.create(req.body, function (err, article) {
        req.check('articleTitle', "Please add a title").notEmpty();
        req.check('articleAuthor', "Please add an author").notEmpty();
        req.check('articleContent', "Nothing to report?").notEmpty();
        req.check('articleHeaderImg', "Please add a header image").notEmpty();
        req.check('articleSideImage', "Please add a side image").notEmpty();

        var errors = req.validationErrors();
        if (errors){
            req.session.errors = errors;
            req.session.success = false;
        } else {
            req.session.success = true;
            req.session.cookie.expires = false;
        }
        res.redirect('/articles/create');
    });
});

//show page to edit the article
router.get('/:id/edit', function (req, res, next){
   Article.findById(req.params.id, function(err, article){
       if (err){
           throw err
       }
       console.log(article);
       res.render('articles/edit', {
           action: '/articles/' + article.id + '?_method=PUT',
           article: article,
           deleteAction: '/articles/' + article.id + '?_method=DELETE'
       });
   });
});

//update the server with changes
router.put('/:id', function (req, res) {
    console.log(req.body);
    Article.findOneAndUpdate({_id: req.params.id}, req.body,
        function (err, article) {
            if (err) {
                throw err;
            }
            res.redirect('/articles/' + article.id)
        });
});

// "Delete the record"
router.delete('/:id', function (req, res) {
    Article.findByIdAndRemove({_id: req.params.id}, function (err) {
        if (err) {
            throw err;
        }
        res.redirect('/articles/');
    });
});


module.exports = router;