/**
 * Created by ronal on 1/9/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Chronicles: GTC', condition:true, anyArray: [1,2,3] });
//});
router.get('/', function (req, res, next) {
    if (req.user) {
        req.logout();
        res.locals.user = null;
        req.flash('success', 'You have successfully logged out!');
        res.redirect('/');
    } else {
        req.flash('error', 'You must be logged in to do that.');
        res.render('back');
    }
});

module.exports = router;