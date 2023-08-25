'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const routes = require('./routes');
const auth = require('./auth');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'pug');
app.set('views', './views/pug');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

  app.route('/').get((req, res) => {
    res.render('index', {
        title: 'Connected to Database',
        message: 'Please log in',
        showLogin: true,
        showRegistration: true
        // showSocialAuth: true
    });
});

app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
});

app.route('/profile').get(/*ensureAuthenticated, */(req, res) => {
    res.render('profile', { username: req.user.username });
});

app.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
});

app.route('/register')
.post((req, res, next) => {
// const hash = bcrypt.hashSync(password, user.password);
myDataBase.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
        next(err);
    } else if (user) {
        res.redirect('/');
    } else {
        myDataBase.insertOne({
        username: req.body.username,
        password: req.body.password
        },
        (err, doc) => {
            if (err) {
                res.redirect('/');
            } else {
            next(null, doc.ops[0]);
            }
    }
    )
    }
},
    passport.authenticate('local', { failureRedirect: '/' },
    (req, res, next) => {
    res.redirect('/profile');
    }
    )
)
});

  // routes(app, myDataBase);
  auth(app, myDataBase);  

  let currentUsers = 0;
  io.on('connection', socket => {
    ++connectedUsers;
    io.emit('user count', currentUsers);
    console.log('A user has connected');
  });

}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
