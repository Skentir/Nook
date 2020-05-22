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
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
            User.findOne({"$or":[{ 'email_address' :profile._json.email}, {'googleId': profile._json.sub}]})
                .exec(function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    // if a user is found, log them in
                    // If no Google Id, assign one
                    if (user.googleId == null) {
                          console.log("No google ID. Adding one.");
                          User.updateOne(
                            {_id: user._id},
                            {$set: {
                              googleId: profile._json.sub
                              }
                            },
                            { "$upsert": true },
                            function(err, result) {
                              if(err) res.send(err)
                              else {
                                console.log("Added Google ID")
                              }
                            }
                          )
                    }
                    return done(null, user);
                } else {
                    const user = new User({
                        first_name : profile._json.given_name,
                        last_name: profile._json.family_name,
                        email_address: profile._json.email,
                        password: profile._json.family_name,
                        photo: "05315a4aa355c6bff09be30717efaaed.jpg"
                    });
                    bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Hashed password
                        user.password = hash;
                        //if the user did not upload any file use default
                        user.save()
                        .then(acct => {
                            return done(null, user);
                        })
                        .catch(err => console.log(err));
                    }))
                }
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