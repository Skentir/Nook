const OrgModel = require('../models/Org');
const EventModel = require('../models/Event');
const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');
let images = [];
exports.view = function(req, res) {
    /*OrgModel.find({})
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
        });*/

        async.parallel({
            //for each(for eaach) org queried, query filename and chunks(waterfall)
          orgs:function gatherOrgData(callback) {
              OrgModel.find({}).select('_id org_type org_logo org_name').limit(1).then(results=>{
                if (results) {
                    async.waterfall([ 
                    function(callbackEach) {
                        //console.log("ok so this is the org---> " + org);
                        //console.log(callbackEach);
                        callbackEach(null, results[0]);
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
                                    finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                                    images.push(finalFile);
                                    callbackEach(null);
                                });
                            }
                        })
                        
                    },
                    function(callbackEach) {
                    //when all item.somethingElse is done, call the upper callback
                        console.log(""+ images.length);
                        callback(null, results);
                    }
                ]);
                }
            })
          },
          events: function gatherEventsData(callback) {
              EventModel.find({}).select('_id event_name header_photo').limit(5).then(results=>{
                               if (results) {
                     callback(null, results);
                 }
              });
          }   
          
          //combine results and render
   
       }, function (err, results) {
           if (err) {
             console.log("error")
         } else {
             console.log(results.events);
         }
       })

};