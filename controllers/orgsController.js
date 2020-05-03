const User = require('../models/User');
const OrgModel = require('../models/Org');
const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

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
    /*
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
    */
   var finalFile1, eventList = [], org;
   OrgModel.findById(orgId)
   .populate('events', '_id event_name header_photo')
       .exec(function(err, result) {
           if (err) {
               res.send(err);
           } else if (!result) {
               // Org not Found
               res.redirect('/explore');
           } else { 
               collection.find({filename: result.org_header})
                   .toArray(function(err, docs) {
                       if(err) {
                        return res.send(err);
                       }
                       if(!docs || docs.length === 0){
                        return res.send(err);
                       } else {
                       //Retrieving the chunks from the db
                       collectionChunks.find({files_id : docs[0]._id}).sort({n: 1})
                           .toArray(function(err, chunks) {
                               if(err){
                                return res.send(err);
                               }
                               if(!chunks || chunks.length === 0){
                               //No data found
                                return res.send(err);
                               }
                               //Append Chunks
                               var fileData = [];
                               for(let i=0; i<chunks.length;i++){
                   
                               //This is in Binary JSON or BSON format, which is stored
                               //in fileData array in base64 endocoded string format
                               fileData.push(chunks[i].data.toString('base64'));
                               }
                               //Display the chunks using the data URI format
                               finalFile1 = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                               org = JSON.parse(JSON.stringify(result));
                               org.orgImage = finalFile1;
                               console.log("HELLO " + result.events)
                                    async.forEach(result.events, function(result,resultCallback) {
                                        async.waterfall([ 
                                            function(callbackEach) {
                                                callbackEach(null, result);
                                            },
                                            function getImageFilname(event, callbackEach){
                                                collection.find({filename: event.header_photo}).toArray(function(err, docs){
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
                                                            finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                        
                                                            //create a json object for the org
                                                            var eventj = JSON.parse(JSON.stringify(event));
                        
                                                            //add the image property to json object and assign the image uri
                                                            eventj.img = finalFile;
                        
                                                            //push it into list of orgs
                                                            eventList.push(eventj);
                                                            callbackEach(null);
                                                        });
                                                    }
                                                })
                                                
                                            },
                                                function(callbackEach) {  
                                                    resultCallback();         
                                                }
                                        ])
                                    }, function(err) { 
                                            var params = {
                                                layout: 'main',
                                                org: org,
                                                events: eventList
                                            };
                                            // console.log(params);
                                           // res.send(params);
                                            res.render('vieworg',params);
                                    })
                            })
                        }
                   }) 
               }
       })
};