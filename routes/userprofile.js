const express = require('express');
const router = express.Router();

const User = require('../models/User');
const userController = require('../controllers/userController');

/*router.get('/user-profile', (req,res, next) => {    
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
});*/

router.get('/user-profile', userController.renderUser);

//View Profile
router.get('/user-profile/:userId', userController.viewprofile);

router.get('/logout', userController.logout);
  
module.exports = router;