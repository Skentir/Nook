const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.login = (req, res, next) => {
    passport.authenticate(['local','google'], {
    successRedirect: '/explore',
    failureRedirect: '/',
    })(req, res, next);
  };

exports.register = (req,res)=> {
    User.findOne({ email_address: req.body.reg_email})
    .then( userr => {
        if(userr) {
            res.redirect('/');
        } else if (!userr) {
            res.redirect('/error');
        } else {
            //if the user does not upload any files
             if(!req.file){
                var user_photo = "05315a4aa355c6bff09be30717efaaed.jpg";
            }
            else{
                user_photo = req.file.filename;
            }
            const user = new User({
                first_name : req.body.reg_fname,
                last_name: req.body.reg_lname,
                id_number: req.body.reg_idnum,
                year_level: req.body.reg_yrlevel,
                email_address: req.body.reg_email,
                password: req.body.reg_pass,
                photo: user_photo
            });
  
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Hashed password
                    user.password = hash;
                    //if the user did not upload any file use default
                    user.save()
                    .then(acct => {
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
                }))
        }
    })
  };