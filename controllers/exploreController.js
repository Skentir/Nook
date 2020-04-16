const express = require('express');

const OrgModel = require('../models/Org');
const EventModel = require('../models/Event');

exports.view = function(req, res) {
    OrgModel.find({})
        .select('_id org_type org_logo org_name')
        .exec( function(err, docs) {
            if (err) {
                res.send(err);
            } else {
                EventModel.find({})
                    .select('_id event_name header_photo')
                    .limit(5)
                    .exec( function(err, result) {
                        if (err) {
                            res.send(err);
                        } else if (!result) {
                            var org = JSON.parse(JSON.stringify(docs));
                            var params = {
                                layout: 'main',
                                orgs: org
                            };
                            res.render('explore', params);
                        } else {
                            var org = JSON.parse(JSON.stringify(docs));
                            var event = JSON.parse(JSON.stringify(result));
                            var params = {
                                layout: 'main',
                                orgs: org,
                                events: event
                            };
                            res.render('explore', params);
                        }
                    });
            }
        });

};