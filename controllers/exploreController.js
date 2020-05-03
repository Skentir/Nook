const OrgModel = require('../models/Org');
const EventModel = require('../models/Event');
const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

exports.view = function(req, res) {
    let orgList = [];
        async.parallel({
            //for each(for eaach) org queried, query filename and chunks(waterfall)
          orgs:function gatherOrgData(callback) {
              OrgModel.find({}).select('_id org_type org_logo org_name').then(results=>{
                if (results) {
                    async.forEach(results, function(result,resultCallback){
                    async.waterfall([ 
                    function(callbackEach) {
                        callbackEach(null, result);
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

                                    //create a json object for the org
                                    var orgj = JSON.parse(JSON.stringify(org));

                                    //add the image property to json object and assign the image uri
                                    orgj.img = finalFile;

                                    //push it into list of orgs
                                    orgList.push(orgj);
                                    callbackEach(null);
                                });
                            }
                        })
                        
                    },
                        function(callbackEach) {
                            resultCallback();
                            //callback(null, results);
                        }
                    ]);
                    
                    },function(err) {
                        //console.log("Loop completed");
                        callback(null, results);
                    })
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
             /*var org = JSON.parse(JSON.stringify(results.orgs))
             for(var i = 0; i<org.length;i++){
                 org[i].img = images[i];
             }*/
             var params = {
                layout: 'main',
                events: JSON.parse(JSON.stringify(results.events)),
                orgs: orgList
              };
             res.render('explore',params);
             //res.send(orgList);
         }
       })

};

exports.searchOrg = function(req, res) {
    var org_name = req.query.org_name;
   
    OrgModel.find({'org_name': { "$regex": org_name, "$options": "i" }})
    .select('_id org_name org_logo')
    .exec( function(err, docs){
        if (err) {
            res.send(err);
        } else {
            var org = JSON.parse(JSON.stringify(docs));
            var params = {
                layout: 'main',
                orgs: org,
            };
            res.render('search', params);
        }
    });
}