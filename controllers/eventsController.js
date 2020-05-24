var mongoose = require('mongoose')

const EventModel = require('../models/Event');
const OrgModel = require('../models/Org');
const async = require('async');
const getDb = require('../config/db').getDb;
const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

var orgID;

function parseTime(s) {
  var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
  var hh = parseInt(part[1], 10);
  var mm = parseInt(part[2], 10);
  var ap = part[3] ? part[3].toUpperCase() : null;
  if (ap === "AM") {
      if (hh == 12) {
          hh = 0;
      }
  }
  if (ap === "PM") {
      if (hh != 12) {
          hh += 12;
      }
  }
  return { hh: hh, mm: mm };
}

function checkTime(s, e) {
  var valid = true

  var start = parseTime(s)
  var end = parseTime(e)

  if(start.hh > end.hh) {
    valid = false
    return valid
  }
  if(start.hh == end.hh && start.mm > end.mm) {
    valid = false
    return valid
  }

  return valid
}

exports.addevent = (req,res)=>{
    var orgId = req.params.orgId;
    var params = {
        orgId : orgId
    }
    res.render('ad-eventreg',params);
};

exports.createevent = (req, res) =>{
   var orgId =  req.params.orgId;
    if(!req.file){
        var event_photo = "117711a9ff985c8287cbdf2504cb1a51.jpg";
    }
    else{
        event_photo = req.file.filename;
    }

    if(checkTime(req.body.start_time, req.body.end_time)) {
      const event = new EventModel({
          event_name: req.body.event_name,
          about_desc: req.body.about_event,
          things: req.body.things, 
          capacity: req.body.capacity,
          current_cap: req.body.capacity,
          header_photo: event_photo,
          venue: req.body.event_venue,
          date: req.body.event_date,  
          start_time:req.body.start_time,
          end_time:req.body.end_time,
          incentives: req.body.incentives,
          codes: req.body.coursecodes,
          organizer_id: req.params.orgId
      })
      event.save().then(event =>{
          OrgModel.findByIdAndUpdate({_id: orgId}, {$push:
          {events: event._id}},(err) =>{
            if(err){
              res.redirect("/error");
            }
            res.redirect('/admin/ad-tools');
          })
      })
    }
    else {
      res.redirect('/error')
    }
}

exports.viewevents = (req,res)=>{
    var orgId = req.params.orgId;
    orgID = req.params.orgId;
    EventModel.find({'organizer_id':orgId}, {event_name:1, date:1})
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else if (!result) {
              res.redirect('/error');
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    events: event,
                    orgId
                };
                res.render('ad-eventview', params);
            }
        });
};

exports.editevent = (req,res)=> {
    var eventId = req.params.eventId;

    EventModel.findById(eventId)
        .populate('organizer_id','_id')
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // No event found
                res.redirect('/ad-tools');
            } else {    
                 collection.find({filename: result.header_photo }).toArray(function(err, docs){
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
                    var event = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main',
                        event,
                        image: finalFile,
                    }
                    res.render('editevent', params);
                  });
                }
            } 
        )}
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



exports.editeventdetails = (req, res) =>{
    if(!req.file){
    EventModel.findByIdAndUpdate({_id: req.params.eventId}, 
      {
      $set: {
        event_name: req.body.edit_event_name,
        about_desc: req.body.edit_about_desc,
        things: req.body.edit_things, 
        venue: req.body.edit_venue,
        date: req.body.edit_event_date,  
        start_time:req.body.edit_start_time,
        end_time:req.body.edit_end_time,
        incentives: req.body.edit_event_incentives

      }
      }, (err)=>{
        if(err) {
          res.send(err);
        } else{
          res.redirect('/admin/eventlist/'+ orgID);
        }
      });
    } else {
    EventModel.findByIdAndUpdate({_id: req.params.eventId}, 
      {
        $set: {
            event_name: req.body.edit_event_name,
            about_desc: req.body.edit_about_desc,
            things: req.body.edit_things, 
            header_photo: req.file.filename,
            venue: req.body.edit_venue,
            date: req.body.edit_event_date,  
            start_time:req.body.edit_start_time,
            end_time:req.body.edit_end_time,
            incentives: req.body.edit_event_incentives
      }
      }, (err)=>{
        if(err) { res.send(err); 
        } else {
          res.redirect('/admin/eventlist/'+ orgID);
        }
      });
    }
}

exports.deleteevent = (req, res) => {
  var eventId = mongoose.Types.ObjectId(req.params. id);

  EventModel.deleteOne({'_id':eventId}, function(err, obj) {
    if(err) res.send(err)
    else {
      res.send('Done!')
    }
  })
}