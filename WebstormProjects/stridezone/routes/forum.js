const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next){
   res.render('forum/index');
});

router.get('/topics/', function (req, res, next){
   res.render('forum/topics/index');
});

router.get('/topics/add/', function (req, res, next){
   res.render('forum/topics/add');
});

module.exports = router;