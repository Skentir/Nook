const express = require('express');
const router = express.Router();

const User = require('../models/User');
const EventModel = require('../models/Event');
const OrgModel = require('../models/Org');
const Request = require('../models/Request');

exports.editorg = (req,res)=> {
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
};

exports.viewofficers = (req,res)=> {
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
};

exports.vieworg = (req,res) => {
    const orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .populate('events', '_id event_name header_photo')
        .exec(function(err, result)  {
            if (err) {
                res.send(err);
              } else  if (!result) {
                // Org not Found
                res.redirect('/explore')
              } else {        
                var org = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    org
                  };
                res.render('vieworg', params);       
            }
        });
};