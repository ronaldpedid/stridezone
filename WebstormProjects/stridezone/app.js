function initializeApp(db){
    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var mongoMiddleware = require('./middleware/mongo');
    var methodOverride = require('method-override');
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);
    var setUserOnLocalsMiddleware = require('./middleware/user-local');
    var promise = require('promise');
    var LocalStrategy = require('passport-local').Strategy;
    var expressHandlebars = require('express-handlebars');
    var User = require('./lib/models/User');
    var passport = require('passport');
    var config = require('./config');
    var secret = "Nibbieamylodgiduke2";
    var index = require('./routes/index');
    var users = require('./routes/users');
    var login = require('./routes/login');
    var register = require('./routes/register');
    var flash = require('express-flash');

    var app = express();
    app.db = db;


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
    var handleBars = expressHandlebars.create({
        layoutsDir: path.join(__dirname, 'views'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        defaultLayout: 'layout',
        extname: '.hbs'
        // helpers: {
        //   formatDate: function (dateString) {
        //     return moment(dateString).format("dddd, MMMM D / h A");
        //   },
        //   setChecked: function (value, currentValue) {
        //     if (value == currentValue) {
        //       return "checked"
        //     } else {
        //       return "";
        //     }
        //   },
        //   toISOFormat: function (value) {
        //     return moment('value').format('YYYY-MM-DDThh:mm');
        //   }
        // }
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
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(mongoMiddleware(config.mongo));
    app.use(session({
        store: new MongoStore({url: config.mongo.connectionString}),
        secret: secret,
        maxAge: 60 * 60 * 1000, // ms; lasts for one hour
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(setUserOnLocalsMiddleware());
    var authRouter = express.Router();
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
    app.use(authRouter);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
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

}
module.exports = initializeApp;
