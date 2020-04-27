const OrgModel = require('../models/Org');
const Request = require('../models/Request');
const UserModel = require('../models/User');

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
                        //   res.json(params);
                        res.render('member-requests', params);
                        }
                    });
            }
        });
};

exports.deleterequest = (req,res)=> {
    var requestId = req.params.reqId;
    /*
    RequestModel.findById(requestId) {
        //delete the request
    }
    // TODO: Delete from Request and User Request
    */
    console.log("Request to delete for "+ requestId);

    var query = {'_id': requestId};
    Request.remove(query, function(err, obj) {
        if(err) throw err;
        else console.log(requestId + " deleted");
    })
}

exports.acceptrequest = (req,res) => {
    var requestId = req.params.reqId;

    
    Request.findById(requestId)
    .exec(function (err, result) {
        new_org = {
            user_id = result.user_id,
            org_id = result.org_id,
            position = result.position
        }
        /*Put Update here*/
        console.log(result);
        
    })
   
    /* DONT DO THIS PART YET!! */
    // Update yung sa org no_of_officers or no_of_members if-else
    console.log("Request to accept for " + requestId);
}

/*
exports.createrequssts ({

    req.body.org_name
    req.body.position
}) */