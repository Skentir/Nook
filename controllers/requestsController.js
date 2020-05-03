const OrgModel = require('../models/Org');
const Request = require('../models/Request');
const UserModel = require('../models/User');
var mongoose = require('mongoose');

exports.viewrequests = (req,res)=> {
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
            
                        res.render('member-requests', params);
                        }
                    });
            }
        });
};

exports.deleterequest = (req,res)=> {
    var requestId = req.params.reqId;
    var query = {'_id': requestId};

    Request.deleteOne(query, function(err, obj) {
        if(err) res.send(err);
        else res.send('member-requests');
    })
}

exports.acceptrequest = (req,res) => {
    var requestId = req.params.reqId;
    
    Request.findById(requestId)
    .exec(function (err, result) {
        new_org = {
            org_id: result.org_id,
            position: result.position
        }

        var conditions = {_id:result.org_id}
        var options = {multi: true}
        var update = {$inc: {no_of_officers: 1}}

        if(result.position == "Member" || result.position == "") {
            update = {$inc: {no_of_members: 1}}
        }

        OrgModel.updateOne(conditions, update, options, function(err, num){
            if(err) res.send(err)
            else {
                UserModel.updateOne(
                    {_id: result.user_id},
                    {$addToSet: {orgs:new_org}},
                    function(err, result) {
                        if(err) res.send(err)
                        else {
                            var query = {'_id': requestId};
            
                            Request.deleteOne(query, function(err, obj) {
                                if(err) res.send(err);
                                else res.send('member-requests')
                            })
                        }
                    }
                )
            }
        });
    });
}

exports.createrequests = (req,res) => {
    var orgName = req.body.org_name
    var pos = req.body.position
    var user = req.session.passport.user
    var userId = mongoose.Types.ObjectId(user)

    OrgModel.findOne({org_name:orgName})
        .lean().exec(function(err, result) {
            if(err) throw err
            else {
                var orgId = result._id

                new_req = {
                    user_id: userId,
                    org_id: orgId,
                    status: "Pending",
                    position: pos
                }
    
                Request.create(new_req, function(err, obj){
                    if(err) res.send(err)
                    else res.send('editprofile')
                })
            }
        });
}