const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { objectID } = require('mongodb');

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
}