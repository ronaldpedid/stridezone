var express = require('express');
var router = express.Router();
var Post = require('../lib/models/Post.js');
var mongoose = require('mongoose');
var lodash = require('lodash');

/* GET home page. */
router.get('/', function (req, res, next) {
    Post.find(function (err, post) {
        if (err) {
            throw err;
        }
        res.render('index', {
            title: 'StrideZone',
            post: post});
    });
});
module.exports = router;
