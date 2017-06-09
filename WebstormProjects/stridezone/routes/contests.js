const express = require('express');
const router = express.Router();
const Mailgun = require('mailgun-js');
const Contest = require('../lib/models/Contest.js');

var api_key = 'key-5b73e4dcc4fe1ec5a7c92d6141eca779'; //API KEY from mailgun
var domain = 'http://localhost:3000'; //domain name www.example.com
var from_who = 'ronaldpedid@live.com'; //email from who@whom.com

router.post('/submit/:mail', function(req,res) {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
        //Specify email data
        from: from_who,
        //The email to contact
        to: req.params.mail,
        //Subject and text data
        subject: 'Hello from Mailgun',
        html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3000/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    };

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.hbs" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by hbs
            res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });

});

router.get('/validate/:mail', function(req,res) {
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var members = [
        {
            address: req.params.mail
        }
    ];
    mailgun.lists('practicelistron@sandboxad33cc2cf1e94782ba036f99cb7ce7d0.mailgun.org').members().add({ members: members, subscribed: true }, function (err, body) {
        console.log(body);
        if (err) {
            res.send("Error - check console");
        }
        else {
            res.send("Added to mailing list");
        }
    });

});

router.get('/', function(req, res, next){

    res.render('contests/index')
});

router.get('/all', function(req, res, next){
    res.render('contests/contests')
});

router.get('/:id', function(req, res, next){
    res.render('contests/contest')
});

router.get('/add', function(req, res, next){
    res.render('contests/add', {
        action: '/submit/:mail'
    })
});


module.exports = router;
