var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var routes = require('./routes/index');
var users = require('./routes/auth');
var api = require('./routes/api');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var session = require('express-session');
var models = require('./models');
var config = require('./config/config');
var methodOverride = require('method-override');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    models.user.find({where: {id: user.id}}).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        done(err, null);
    });
});

// authetication setup
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {

        User.find({where: {email: email}}).then(function (user) {

            passwd = user ? user.password : '';
            isMatch = models.user.validPassword(password, passwd, done, user);
            // if (!user) {
            //     console.log('Incorrect email address.');
            //     return done(null, false, {message: 'Incorrect email address.'});
            // }
            // if (!user.validPassword(password)) {
            //     return done(null, false, {message: 'Incorrect password.'});
            // }
            // return done(null, user);
        });
    }
));
// models.user.destroy({where:{email:'arking@ukr.net'}}).then(function (res) {
//     console.log(res);
// });
// models.todo_list.create({title:'ttile ',user_id:13}).then(function (res) {
//      console.log(res);
//  });
// models.todo_item.create({content:'task 1 content',todo_list_id:12}).then(function (res) {
//      console.log(res);
//  });
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, function (req, email, password, done) {
    // console.log(req.body);
    models.user.findOne({
        where: {
            email: email
        }
    }).then(function (user) {
        if (user) return done(null, false);
        if (!user) {
            models.user.create(req.body).then(function (res) {
                console.log(res.dataValues);
            });
        }
    })
}));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.set('superSecret', config.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({
    genid: function (req) {
        return uuid.v1();
    },
    secret: 'Phoenix,BerniceAjgioiguoquou05u98unfau0t84095u02105aioa',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// models.user.findAll().then(function (todoList) {
//     console.log(todoList);
// });

var User = require('./models').user;

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}

module.exports = app;
