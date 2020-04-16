const express = require('express');

const passport = require('passport');
const OrgModel= require('../models/Org');

exports.login = (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/explore',
    failureRedirect: '/',
    })(req, res, next);
  };

exports.register = (req,res)=> {
    User.findOne({ email_address: req.body.reg_email})
    .then( userr => {
        if(userr){
            console.log("user exists");
        }
        else{
            const user = new User({
                first_name : req.body.reg_fname,
                last_name: req.body.reg_lname,
                id_number: req.body.reg_idnum,
                year_level: req.body.reg_yrlevel,
                email_address: req.body.reg_email,
                password: req.body.reg_pass,
                photo: req.file.filename
            });
  
            console.log(user.first_name);
  
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Hashed password
                    user.password = hash;
                    user.save()
                    .then(acct => {
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
                }))
        }
    })
  };