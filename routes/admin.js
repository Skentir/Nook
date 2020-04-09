const express = require('express');
const router = express.Router();

const User = require('../models/User');
const EventModel = require('../models/Event');
const OrgModel = require('../models/Org');
const Request = require('../models/Request');

router.get('/ad-tools', (req,res)=> {
    /* TODO: GET ORG ID FROM USER */
    
    var obj = {
        _id : "5e8229291c9d4400009aa35f"
    }
    res.render('ad-tools', obj);
});

router.get('/ad-eventreg', (req,res)=>{
    res.render('ad-eventreg');
})

router.get('/eventlist/:orgId', (req,res)=>{
    var orgId = req.params.orgId;

    EventModel.find({'organizer_id':orgId}, {event_name:1, date:1})
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    events: event
                };
                res.render('ad-eventview', params);
            }
        });
})



router.get('/editorg/:orgId', (req,res)=> {
    var orgId = req.params.orgId;
    /* TODO: Get req.user.email from session or the id */
    OrgModel.findById(orgId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                res.redirect('/ad-tools');
            } else {
                var org = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    org
                };
                res.render('editorg', params);
            }
        });
})

router.get('/editevent/:eventId', (req,res)=> {
    var eventId = req.params.eventId;
    
    EventModel.findById(eventId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // No event found
                res.redirect('/ad-tools');
            } else {
                event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    event
                };
                res.render('editevent', params);
            }
        });
})

router.get('/member-requests/:orgId', (req,res)=> {
    var orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .select('tags org_name org_logo no_of_members no_of_officers')
        .exec(function (err, docs) {
            if (err) { res.send(err) 
            } else if (!docs) { 
                res.redirect('/ad-tools'); // Org Not Found
            } else {
                Request.find({org_id: docs._id})
                    .select('position')
                    .populate('user_id', '_id photo id_number first_name last_name')
                    .exec(function (err, result) {
                        if (err) { res.send(err) 
                        } else if (!result) {
                            // Request not found, send org data
                            var orgs = JSON.parse(JSON.stringify(docs));
                            var params = {
                                layout: 'main',
                                org: orgs
                            }
                            res.render('member-requests', params);
                        } else {
                            var orgs = JSON.parse(JSON.stringify(docs));
                            var request = JSON.parse(JSON.stringify(result));
                            var params = {
                                layout: 'main',
                                reqs:request,
                                org: orgs
                            }
                        //   res.json(params);
                        res.render('member-requests', params);
                        }
                    });
            }
        });
});




router.get('/view-officers/:orgId', (req,res)=> {
    const orgId = req.params.orgId;

    OrgModel.find({'_id':orgId}, {'org_id':orgId})
    .select('org_name org_logo tags no_of_officers no_of_members date_established')
    .limit(1)
    .exec(function(err, org)  {
        if (err) {
            res.send(err);
        } else {        

        User.find({'orgs.org_id':orgId}, { 'orgs.position': { $ne: null } })
            .select('_id photo first_name last_name orgs.position')
            .exec(function(err, result)  {
                if (err) {
                    res.send(err);
                } else if (!result) {
                    // No officers found, return org data
                    var orgs = JSON.parse(JSON.stringify(org));
                    var params = {
                        layout: 'main', 
                        org_data: orgs
                    };
                res.render('view-officers', params);
                } else {       
                    var orgs = JSON.parse(JSON.stringify(org));
                    var officer = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main', 
                        org_data: orgs,
                        officers: officer
                        }
                    };
                    res.render('view-officers', params);
            }); 
        }
    }); 
});


module.exports = router;