var express = require('express');
var router = express.Router();
var User = require('../lib/models/User');
var passport = require('passport');

router.get('/', function (req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login', {
            success: req.session.success,
            errors: req.session.errors
        });
    }
});

router.post('/', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
module.exports = router;

router.post('/register', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var emailAddress = req.body.emailAddress;

    req.check('username', "Please enter a username").notEmpty();
    req.check('password', "Please enter a password").notEmpty();
    req.check('firstname', "Please enter a firstname").notEmpty();
    req.check('lastname', "Please enter a lastname").notEmpty();
    req.check('emailAddress', "Please enter a valid email").isEmail();

    var errors = req.validationErrors();
    if (errors){
        req.session.errors = errors;
        req.session.success = false;
    } else {
        req.session.success = true;
        req.session.cookie.expires = false;
    }

    var newuser = new User();
    newuser.username = username;
    newuser.password = password;
    newuser.firstname = firstname;
    newuser.lastname = lastname;
    newuser.emailAddress = emailAddress;
    newuser.save(function (err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.redirect('/login');
    })
});