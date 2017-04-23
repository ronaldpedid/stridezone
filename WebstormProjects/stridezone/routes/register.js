
var express = require('express');
var router = express.Router();
var User = require('../lib/models/User');

/* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Chronicles: GTC', condition:true, anyArray: [1,2,3] });
//});

router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var newuser = new User();
    newuser.username = username;
    newuser.password = password;
    newuser.firstname = firstname;
    newuser.lastname = lastname;
    newuser.save(function (err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        return res.redirect('/login');
    })
})

module.exports = router;