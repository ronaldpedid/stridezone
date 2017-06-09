function initializeApp(db) {
    //modules
    const express = require('express');
    const path = require('path');
    const favicon = require('serve-favicon');
    const logger = require('morgan');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const methodOverride = require('method-override');
    const setUserOnLocalsMiddleware = require('./middleware/user-local');
    const promise = require('promise');
    const LocalStrategy = require('passport-local').Strategy;
    const expressHandlebars = require('express-handlebars');
    const User = require('./lib/models/User');
    const passport = require('passport');
    const config = require('./config');
    const flash = require('express-flash');
    const nodemailer = require('nodemailer');
    const moment = require('moment');
    const jquery = require('jquery');
    const Mailgun = require('mailgun-js');
    const multer = require('multer');

    //mongo db - validation - login  //
    const mongoMiddleware = require('./middleware/mongo');
    const expressValidator = require('express-validator');
    const session = require('express-session');
    const MongoStore = require('connect-mongo')(session);


    //secret key//
    const secret = "Nibbieamylodgiduke2";
    //routes //
    const index = require('./routes/index');
    const users = require('./routes/users');
    const login = require('./routes/login');
    const logout = require('./routes/logout');
    const register = require('./routes/register');
    const posts = require('./routes/posts');
    const meta = require('./routes/meta_game');
    const forum = require('./routes/forum');
    const articles = require('./routes/articles');
    const registered = require('./routes/registered');
    const contests = require('./routes/contests');
    const video = require('./routes/video');

    // app //
    const app = express();
    app.db = db;

    //Passpost local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log('inside local strategy');
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username or password'});
                }
                user.comparePassword(password, function (err, isMatch) {
                    console.log(user);
                    if (err) {
                        return done(err);
                    } else if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Incorrect username or password'});
                    }
                });
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        console.log('serialize', user.id);
        return done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        console.log('deserialize', id);
        User.findById(id, function (err, user) {
            if (err) {
                console.log('error in deserialize', err);
                return done(err);
            }
            done(null, user)
        });
    });
    const handleBars = expressHandlebars.create({
        layoutsDir: path.join(__dirname, 'views'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        defaultLayout: 'layout',
        extname: '.hbs',
        helpers: {
            formatDate: function (dateString) {
                return moment(dateString).format("dddd, MMMM D / h  A");
            },
            setChecked: function (value, currentValue) {
                if (value == currentValue) {
                    return "checked"
                } else {
                    return "";
                }
            },
            toISOFormat: function (value) {
                return moment('value').format('YYYY-MM-DDThh:mm');
            },
            makeBlurb: function (content) {
                if (content !== "") {
                    return content.substring(0, 200)
                } else {
                    return "";
                }
            }
        }
    });


// mailgun api
    var api_key = 'key-5b73e4dcc4fe1ec5a7c92d6141eca779'; //API KEY from mailgun
    var domain = 'localhost:3000'; //domain name www.example.com
    var from_who = 'ronaldpedid@live.com'; //email from who@whom.com
    app.use(express.static(__dirname + '/js'));

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
// The index redirects here
    app.get('/submit/:mail', function(req,res) {

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

    app.get('/validate/:mail', function(req,res) {
        var mailgun = new Mailgun({apiKey: api_key, domain: domain});

        var members = [
            {
                address: req.params.mail
            }
        ];
//For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below
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

    app.get('/invoice/:mail', function(req,res){
        //Which file to send? I made an empty invoice.txt file in the root directory
        //We required the path module here..to find the full path to attach the file!
        var path = require("path");
        var fp = path.join(__dirname, 'invoice.txt');
        //Settings
        var mailgun = new Mailgun({apiKey: api_key, domain: domain});

        var data = {
            from: from_who,
            to: req.params.mail,
            subject: 'An invoice from your friendly hackers',
            text: 'A fake invoice should be attached, it is just an empty text file after all',
            attachment: fp
        };


        //Sending the email with attachment
        mailgun.messages().send(data, function (error, body) {
            if (error) {
                res.render('error', {error: error});
            }
            else {
                res.send("Attachment is on its way");
                console.log("attachment sent", fp);
            }
        });
    });

// view engine setup
    app.engine("hbs", handleBars.engine);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(methodOverride("_method"));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(expressValidator());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(mongoMiddleware(config.mongo));
    app.use(session({
        store: new MongoStore({url: config.mongo.connectionString}),
        secret: secret,
        maxAge: 60 * 60 * 1000, // ms; lasts for one hour
        resave: false,
        saveUninitialized: false,
        cookie:{
            secure: false,
            maxAge: 216000000
        }
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(setUserOnLocalsMiddleware());
    const authRouter = express.Router();
    authRouter.use(function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login');
    });

    app.use('/', index);
    app.use('/users', users);
    app.use('/login', login);
    app.use('/register', register);
    app.use('/posts/', posts);
    app.use('/meta_game/', meta);
    app.use('/meta_game/decks/create', meta);
    app.use('/forum/', forum);
    app.use('/articles/', articles);
    app.use('/articles/create', articles);
    app.use('/registered/', registered);
    app.use('/contests/', contests);
    app.use('/videos/', video);
    authRouter.use('/logout', logout);
    authRouter.use('/posts/', posts);
    authRouter.use('/posts/create/', posts);
    app.use(authRouter);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    return app;

}
module.exports = initializeApp;
