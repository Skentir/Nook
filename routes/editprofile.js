const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Request = require('../models/Request');

router.get('/editprofile', (req,res, next)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
        var userId = req.session.passport.user;
        
        User.findById(userId)
        .exec(function (err,user) {
            if (err) {
                res.send(err);
            } else {

                Request.find({user_id: userId})
                .populate('org_id', '_id org_name org_logo')
                .exec(function (err,result) {
                    if (err) {
                        res.send(err);
                    } else if (!result) {
                        // No pending request found
                        var users = JSON.parse(JSON.stringify(user));
                        var params = {
                            layout: 'main',
                            user_data: users,
                        };
                        res.render('edit-profile', params);
                    } else {
                        var users = JSON.parse(JSON.stringify(user));
                        var reqs = JSON.parse(JSON.stringify(result));
                        var params = {
                            layout: 'main',
                            user_data: users,
                            requests: reqs
                        };
                        res.render('edit-profile', params);
                    }
                });
            }
        });
    }
});

module.exports = router;