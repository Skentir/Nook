const express = require('express');
const router = express.Router();

const User = require('../models/User');


router.get('/user-profile', (req,res, next) => {    
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
        var userId = req.session.passport.user;
        User.findById(userId)
                .populate('orgs.org_id','_id org_name org_logo')
                .exec( function(err,result) { 
                    if (err) { res.send(err);
                    } else  {
                    var user = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main',
                        isUser: true,
                        info:user
                    }
                    res.render('user-profile', params);   
                    }                           
                });
    }
});



//View Profile
router.get('/user-profile/:userId', (req,res, next) => {    
    var userId = req.params.userId;
    User.findById(userId)
            .populate('orgs.org_id','_id org_name org_logo')
            .exec( function(err,result) { 
                if (err) { res.send(err)
                } else if (!result)  {
                    // User not Found
                    res.redirect('/explore');
                } else {
                    var user = JSON.parse(JSON.stringify(result));
                    // Goes to user profile
                    var bool = false;
                    if (req.user) {
                        if (req.session.passport.user == userId)
                            bool = true;       
                    }
                    
                    var params = {
                        layout: 'main',
                        isUser: bool,
                        info:user
                    }
                    res.render('user-profile', params);   
                }                           
            });
});


router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
 });
  

module.exports = router;