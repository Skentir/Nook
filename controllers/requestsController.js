var mongoose = require('mongoose');
const OrgModel = require('../models/Org');
const Request = require('../models/Request');
const UserModel = require('../models/User');

const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

exports.viewrequests = (req,res)=> {
    var orgId = req.params.orgId;
    var orgj;
    let requestList = [];
    var orgm;
            //for each(for eaach) org queried, query filename and chunks(waterfall)
                OrgModel.findById(orgId)
                    .select('tags org_name org_logo no_of_members no_of_officers')
                    .then( results => {
                        if (results) {
                            async.waterfall([ 
                                function(callbackEach) {
                                    orgm = results;
                                    callbackEach(null, results);
                                },
                                function getImageFilname(org, callbackEach){
                                    collection.find({filename: org.org_logo}).toArray(function(err, docs){
                                        if(err){
                                        return callbackEach(err);
                                        }
                                        if(!docs || docs.length === 0){
                                        return callbackEach(err);
                                        }else{
                                        //Retrieving the chunks from the db
                                            collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
                                                if(err){
                                                return callbackEach(err);
                                                }
                                                if(!chunks || chunks.length === 0){
                                                //No data found
                                                return callbackEach(err);
                                                }
                                                //Append Chunks
                                                var fileData = [];
                                                for(let i=0; i<chunks.length;i++){
                                
                                                //This is in Binary JSON or BSON format, which is stored
                                                //in fileData array in base64 endocoded string format
                                                fileData.push(chunks[i].data.toString('base64'));
                                                }
                                                //Display the chunks using the data URI format
                                                var finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
            
                                                //create a json object for the org
                                                orgj = JSON.parse(JSON.stringify(org));
            
                                                //add the image property to json object and assign the image uri
                                                orgj.img = finalFile;
                                                callbackEach(null);
                                            });
                                        }
                                    })
                                }, function gatherEventsData(callbackEach) {
                                    Request.find({org_id: orgm._id})
                                        .select('position')
                                        .populate('user_id', '_id photo id_number first_name last_name')
                                        .then(results=>{
                                            if (results) {
                                                async.forEach(results, function(result,resultCallback){
                                                    async.waterfall([ 
                                                    function(callbackEach2) {
                                                        callbackEach2(null, result);
                                                    },
                                                    function getImageFilname(request, callbackEach2){
                                                        collection.find({filename: request.user_id.photo}).toArray(function(err, docs){
                                                            if(err){
                                                                return callbackEach2(err);
                                                            }
                                                            if(!docs || docs.length === 0){
                                                                return callbackEach2(err);
                                                            } else {
                                                            //Retrieving the chunks from the db
                                                                collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
                                                                    if(err){
                                                                    return callbackEach2(err);
                                                                    }
                                                                    if(!chunks || chunks.length === 0){
                                                                    //No data found
                                                                    return callbackEach2(err);
                                                                    }
                                                                    //Append Chunks
                                                                    var fileData = [];
                                                                    for(let i=0; i<chunks.length;i++){
                                                    
                                                                    //This is in Binary JSON or BSON format, which is stored
                                                                    //in fileData array in base64 endocoded string format
                                                                    fileData.push(chunks[i].data.toString('base64'));
                                                                    }
                                                                    //Display the chunks using the data URI format
                                                                    var finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                                
                                                                    //create a json object for the org
                                                                    var requestj = JSON.parse(JSON.stringify(request));
                                
                                                                    //add the image property to json object and assign the image uri
                                                                    requestj.img = finalFile;
                                
                                                                    //push it into list of orgs
                                                                    requestList.push(requestj);
                                                                    callbackEach2(null);
                                                                });
                                                            }
                                                        })
                                                        
                                                    }, function(callbackEach2) {
                                                            resultCallback();
                                                        }
                                                    ]);
                                                },  function(err) {
                                                        callbackEach(null, results);
                                                    });
                                        }
                                    });
                                },function(err){
                                        var params = {
                                            layout: 'main',
                                            reqs: requestList,
                                            org: orgj
                                        };
                                        res.render('member-requests',params);
                                        //res.send(params);
                            }])    
                        }
                        else{
                            res.redirect('/ad-tools');
                        }
                    }
                )
};
            
exports.cancelrequest = (req,res)=> {
    var requestId =  mongoose.Types.ObjectId(req.params.reqId);
    var query = {'_id': requestId};

    Request.deleteOne(query, function(err, obj) {
        if(err) res.send(err);
        else {
            res.send("Done!");
        };
    })
}

exports.acceptrequest = (req,res) => {
    var requestId = req.params.reqId;
    
    Request.findById(requestId)
    .exec(function (err, result) {
        if (err) res.send(err)
        else if (!result)  res.redirect('/error');
        else {
            new_org = {
                org_id: result.org_id,
                position: result.position
            }

            var update = {$inc: {no_of_officers: 1}}

            if(result.position == "Member" || result.position == "") {
                update = {$inc: {no_of_members: 1}}
            }

            OrgModel.updateOne(
                {_id:result.org_id},
                update, 
                {multi: true}, 
                function(err, num){
                    if(err) res.send(err)
                    else if (!num)  res.redirect('/error');
                    else {
                        UserModel.updateOne(
                            {_id: result.user_id},
                            {$addToSet: {orgs:new_org}},
                            function(err, result) {
                                if(err) res.send(err)
                                else if (!result)  res.redirect('/error');
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
        }
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
                else if (!result) {
                    res.redirect('/error');
                } else {
                    var orgId = result._id
                    new_req = new Request({
                        user_id: userId,
                        org_id: orgId,
                        status: "Pending",
                        position: pos
                    })
        
                    new_req.save().then(req=> {
                        if (err) res.send(err)
                        else res.send("Success");
                    })
                }
            });
}