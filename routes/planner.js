const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/planner', (req,res)=> {
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
});

module.exports = router;