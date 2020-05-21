const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


const User= require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
            User.findOne({ email_address: email})
            .then( user => {
                if(!user){
                    return done(null, false, {message: "Email is not registered"});
                }
                
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, {message: "Password incorrect"});
                    }
                })
            })
            .catch(err => console.log(err));
        })
    );

    passport.use(new GoogleStrategy({
        clientID: "473203977419-av5ghakish7399o9fvv84cq1n8o5e7t1.apps.googleusercontent.com",
        clientSecret: "yMT9metH87ZqLHKWmj2zNOs3",
        callbackURL: "/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
            console.log("PROFIEL: "+JSON.stringify(profile))
            User.findOne({ 'email_address' :profile._json.email}, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } //else
            })
        })
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

}