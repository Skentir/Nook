const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

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
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, acct) {
            done(err, user);
        });
    });

}