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
              OrgModel.find({}).select('_id org_type org_logo org_name').limit(2).then(results=>{
                if (results) {
                    async.eachSeries(results, 
                    function(org, callbackEach) {
                        console.log("ok so this is the org---> " + org);
                        console.log(callbackEach);
                        callbackEach(org,callbackEach);
                    },
                    function getImageFilname(org, callbackEach){
                        console.log("we are getting the filename for this org--->"+ org);
                        var filename = collection.find({filename:org.org_logo}).toArray();
                        console.log("2->>>"+callbackEach);
                        callbackEach(filename,callbackEach);
                    },
                    function getImageChunks(filename,callbackEach3){
                        var imagechunks = collectionChunks.find({files_id : filename._id}).sort({n: 1}).toArray();
                        callbackEach3(imagechunks,callbackEach3);
                    },
                    function formatAndAddImage(imagechunks, callbackEach){
                        var fileData = [];
                        for(let i=0; i<imagechunks.length;i++){
                            fileData.push(imagechunks[i].data.toString('base64'));
                        }

                        finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                        images.push(finalFile);
                        callbackEach(null);
                    },
                    function() {
                    //when all item.somethingElse is done, call the upper callback
                        console.log(""+ images.length);
                        callback(null, results);
                    });
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
   
       }, function (err, docs) {
           if (err) {
             console.log("error")
         } else {
             console.log(docs);
         }
       })

};