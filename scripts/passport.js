
const LocalStrategy = require('passport-local').Strategy;

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use('local', new LocalStrategy({
        usernameField:'email'
    },
        function(email, password, done) {
            console.log('finding...');
            User.findOne({ email_address: email }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.password!=password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};