const User = require('../models/User');
const OrgModel = require('../models/Org');
const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

exports.editorg = (req,res)=> {
    var orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                res.redirect('/ad-tools');
            } else {
                collection.find({filename: result.org_logo }).toArray(function(err, docs){
                    if(err){
                      return res.send(err);
                    }
                    if(!docs || docs.length === 0){
                      return res.send(err);
                    }else{
                      //Retrieving the chunks from the db
                      
                      collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
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
                        var finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                        var org = JSON.parse(JSON.stringify(result));
                        var params = {
                            layout: 'main',
                            org,
                            image: finalFile,
                        }
                        res.render('editorg', params);  
                      });
                    }
                } 
            )}
        });
};

exports.viewofficers = (req,res)=> {
    const orgId = req.params.orgId;
    var orgj;
    let officerList = [];
        async.parallel({
            //for each(for eaach) org queried, query filename and chunks(waterfall)
            orgs:function gatherOrgData(callback) {
                OrgModel.findById(orgId)
                    .select('org_name org_logo tags no_of_officers no_of_members date_established')
                    .then( results => {
                        if (results) {
                            async.waterfall([ 
                                function(callbackEach) {
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
                                }, function(callbackEach) {
                                        callback(null, results);
                                    }
                            ])    
                        }
                    }
                )
            },
            officers: function gatherEventsData(callback) {
                User.find(
                    {   'orgs': {$elemMatch: {org_id: orgId,
                        position: {$nin: ['Member',null]}}}
                    },{'orgs.$':1})
                    .select('_id photo first_name last_name')
                    .then(results=>{
                        if (results) {
                            async.forEach(results, function(result,resultCallback){
                                async.waterfall([ 
                                function(callbackEach) {
                                    callbackEach(null, result);
                                },
                                function getImageFilname(officer, callbackEach){
                                    collection.find({filename: officer.photo}).toArray(function(err, docs){
                                        if(err){
                                            return callbackEach(err);
                                        }
                                        if(!docs || docs.length === 0){
                                            return callbackEach(err);
                                        } else {
                                        //Retrieving the chunks from the db
                                            collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
                                                if(err){
                                                return callbackEach(err);
                                                }
                                                if(!chunks || chunks.length === 0){
                                                //No data found
                                                return callbackEach(err);
                                                }
                                                var bool = false;
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
                                                var officerj = JSON.parse(JSON.stringify(officer));
            
                                                //add the image property to json object and assign the image uri
                                                if (req.user) {
                                                    if (req.session.passport.user == officer._id)
                                                        bool = true;       
                                                }
                                                officerj.img = finalFile;
                                                officerj.isUser = bool;
                                                //push it into list of orgs
                                                officerList.push(officerj);
                                                callbackEach(null);
                                            });
                                        }
                                    })
                                    
                                }, function(callbackEach) {
                                        resultCallback();
                                    }
                                ]);
                            },  function(err) {
                                    callback(null, results);
                                });
                    } else  res.redirect('/error');
                });
            }   
   
       }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                var params = {
                    layout: 'main',
                    officers: officerList,
                    org_data: orgj
                };
                res.render('view-officers',params);
            }
       })
};


exports.vieworg = (req,res) => {
    const orgId = req.params.orgId;
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
                                            res.render('vieworg',params);
                                    })
                            })
                        }
                   }) 
               }
       })
};

exports.editorgdetails = (req, res) => {
    if(!req.file){
    OrgModel.findByIdAndUpdate({_id: req.params.orgId}, 
      {
      $set: {
        org_name: req.body.edit_org_name,
        about_desc: req.body.edit_about_desc,
        join_desc: req.body.edit_join_desc,
        email: req.body.edit_email,
        fb_url: req.body.edit_fb_url,
        ig_url: req.body.edit_ig_url

      }
      }, (err)=>{
        if (err) {
          res.send(err);
        } else {
          res.redirect('/admin/ad-tools');
        }
      })
    }

   else{
    OrgModel.findByIdAndUpdate({_id: req.params.orgId}, 
      {
        $set: {
            org_name: req.body.edit_org_name,
            about_desc: req.body.edit_about_desc,
            join_desc: req.body.edit_join_desc,
            email: req.body.edit_email,
            org_header: req.file.filename,
            fb_url: req.body.edit_fb_url,
            ig_url: req.body.edit_ig_url
      }
      }, (err)=>{
        if(err) res.send(err);
        else res.redirect('/admin/ad-tools');
      })
    }
}

