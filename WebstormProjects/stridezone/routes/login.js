var express = require('express');
var router = express.Router();
var User = require('../lib/models/User');
var passport = require('passport');

router.get('/', function (req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.post('/', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
module.exports = router;