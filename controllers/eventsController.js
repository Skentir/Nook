const EventModel = require('../models/Event');
const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

exports.addevent = (req,res)=>{
    res.render('ad-eventreg');
};

exports.viewevents = (req,res)=>{
    var orgId = req.params.orgId;

    EventModel.find({'organizer_id':orgId}, {event_name:1, date:1})
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    events: event
                };
                res.render('ad-eventview', params);
            }
        });
};

exports.editevent = (req,res)=> {
    var eventId = req.params.eventId;
    
    EventModel.findById(eventId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // No event found
                res.redirect('/ad-tools');
            } else {
                event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    event
                };
                res.render('editevent', params);
            }
        });
};

exports.viewevent = (req,res)=> {
    const eventId = req.params.eventId;
    var finalFile1, finalFile2, event, org;
    EventModel.findById(eventId)
        .populate('organizer_id', '_id org_name org_logo')
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // Event not Found
                res.redirect('/explore');
            } else { 
                collection.find({filename: result.header_photo})
                    .toArray(function(err, docs) {
                        if(err){
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
                                event = JSON.parse(JSON.stringify(result));
                                event.eventImage = finalFile1;
                                
                                collection.find({filename: result.organizer_id[0].org_logo})
                                    .toArray(function(err, result2) {
                                        if(err){
                                        return res.send(err);
                                        }
                                        if(!docs || docs.length === 0){
                                            return res.send(err);
                                        } else {
                                        //Retrieving the chunks from the db  
                                        collectionChunks.find({files_id : result2[0]._id}).sort({n: 1})
                                            .toArray(function(err, chunks2) {
                                                if(err){
                                                return res.send(err);
                                                }
                                                if(!chunks2 || chunks2.length === 0){
                                                //No data found
                                                return res.send(err);
                                                }
                                                //Append Chunks
                                                var fileData = [];
                                                for(let i=0; i<chunks2.length;i++) {
                                    
                                                //This is in Binary JSON or BSON format, which is stored
                                                //in fileData array in base64 endocoded string format
                                                fileData.push(chunks2[i].data.toString('base64'));
                                                }
                                                //Display the chunks using the data URI format
                                                finalFile2 = 'data:' + result2[0].contentType + ';base64,' + fileData.join('');
                                                event.orgImage = finalFile2;

                                                var params = {
                                                    layout: 'main',
                                                    event
                                                } 
                                                res.render('viewevent', params)
                                            })
                                        }
                                    });         
                            })
                        }
                    }) 
                }
        })
};