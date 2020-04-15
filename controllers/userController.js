const express = require('express');
const router = express.Router();

const User = require('../models/User');
const EventModel = require('../models/Event');
const OrgModel = require('../models/Org');
const Request = require('../models/Request');

exports.viewtools = (req,res)=> {
    /* TODO: GET ORG ID FROM USER */
    
    var obj = {
        _id : "5e8229291c9d4400009aa35f"
    }
    res.render('ad-tools', obj);
};

exports.editprofile = (req,res, next)=> {
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
};

exports.viewplanner = (req,res)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
    var userId = req.session.passport.user;
    User.findById(userId)
            .populate('planner','_id event_name header_photo')
            .exec( function(err,result) { 
                if (err) { res.send(err)
                } else  {
                    var user = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main',
                        info:user
                    }
                    res.render('planner', params);   
                }                           
            });
    }
};

exports.viewprofile = (req,res, next) => {    
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
};

exports.logout = function(req, res, next) {
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
};