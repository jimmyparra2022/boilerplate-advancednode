const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { objectID } = require('mongodb');
const GitHubStrategy = require('passport-github').Strategy;

module.exports = function (app, myDataBase) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
        myDataBase.findOne({ _id: new objectID(id) }, (err, done) => {
        done(null, doc);
        });
    });

    passport.use(new LocalStrategy((username, password,) => {
        myDataBase.fineOne({username: username}, (err, user) => {
        console.log(`User ${username} attempted to log in.`);
        if (err) {
            return done(err);
        } else if (!user) {
            return done(null, false);
        } else if (!bcrypt.compareSync(user.password)) {
            return done(null, false);
        } else {
            return done(null, user);
        }
        });
    }));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'boilerplate-advancednode.jimmythewebdeve.repl.co/auth/github/callback'
    }, function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
    }))

}