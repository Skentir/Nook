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

    var query = {'_id': requestId};
    Request.remove(query, function(err, obj) {
        if(err) throw err;
        else console.log(requestId + " deleted");
    })
}

exports.acceptrequest = (req,res) => {
    var requestId = req.params.reqId;
    /*
    RequestModel.find(id:requestId)
    .exec( function (req,result) { 
    
    UserModel.find(result.user_id) {
    //basata append tas update
    }
    
    })}*/
    // Add to User Organizations n include the position


    /* DONT DO THIS PART YET!! */
    // Update yung sa org no_of_officers or no_of_members if-else
    console.log("Request to accept for "+requestId)
}