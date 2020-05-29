var mongoose = require('mongoose')
const getDb = require('../config/db').getDb;
const User = require('../models/User');
const Request = require('../models/Request');
const OrgModel = require('../models/Org');
const Event = require('../models/Event');
const async = require('async');
var mongoose = require('mongoose');

const db = getDb();
      
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

exports.viewtools = (req,res)=> {
  var user_id = req.session.passport.user;
  OrgModel.find({officers: { "$in" : [user_id]} })
    .select('id')
    .exec( function(err, result) {
      if (err) {
        res.send(err);
      } else {
        result = JSON.parse(JSON.stringify(result))
        var params = {
          layout: 'main',
          result
        }
        res.render('ad-tools', params);
      }
    })
};

exports.editprofile = (req,res,next)=> {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    var userId = req.session.passport.user;
    var id = mongoose.Types.ObjectId(userId);
    let userj;
    let reqList = []
    async.parallel({
          reqs:function gatherRequests(callback) {
            Request.find({user_id:id})
            .populate('org_id', '_id org_name org_logo position').then(results=>{
                if (results) {
                    async.forEach(results, function(result,resultCallback) {
                      async.waterfall([ 
                        function(callbackEach) {
                            callbackEach(null, result);
                        },
                        function getImageFilname(request, callbackEach) {
                          collection.find({filename: request.org_id.org_logo}).toArray(function(err, docs){
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
                                      var reqj = JSON.parse(JSON.stringify(request));
  
                                      //add the image property to json object and assign the image uri
                                      reqj.img = finalFile;
  
                                      //push it into list of orgs
                                      reqList.push(reqj);
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
                    },
                    function(err){
                          callback(null, results);
                    });
                }
            })
          },
          user: function gatherUserData(callback) {
            User.findById(userId)
            .then( results => {
                if (results) {
                    async.waterfall([ 
                        function(callbackEach) {
                            callbackEach(null, results);
                        },
                        function getImageFilname(user, callbackEach){
                            collection.find({filename: user.photo}).toArray(function(err, docs){
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
                                        userj = JSON.parse(JSON.stringify(user));
    
                                        //add the image property to json object and assign the image uri
                                        userj.img = finalFile;
                                        callbackEach(null);
                                    });
                                }
                            })
                        }, function(callbackEach) {
                                callback(null, results);
                            }
                    ])  
                  }  
          })
        }
      }, function (err, results) {
          if (err) {
            res.send(err)
        } else {
            var params = {
                layout: 'main',
                requests: reqList,
                user: userj
              }
            res.render('edit-profile',params);
        }
      });
  }
}
exports.viewplanner = (req,res)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
    var userId = req.session.passport.user;
    var fileName = res.locals.photo;
    var eventList = [], userj;

    function dates2(event1, event2) {
      return new Date(event1.date) - new Date(event2.date)
    }
    
    function dates1(event1, event2) {
      event1.entries.sort(dates2).forEach(function(e){
        console.log("")
      });
      event2.entries.sort(dates2).forEach(function(e){
        console.log("")
      });
      return new Date(event1.monthyear) - new Date(event2.monthyear);
    }

    User.findById(userId)
      .select('planner short_bio first_name last_name photo email_address')
      .exec(function(err, user) {
        if (err) res.send(err)
        else if (!user) res.redirect('/error');
        else {
          collection.find({filename: user.photo}).toArray(function(err, docs){
            if(err){
              return callbackEach(err);
            }
            if(!docs || docs.length === 0){
              return callbackEach(err);
            }else{
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
                for(let i=0; i<chunks.length;i++)
                  fileData.push(chunks[i].data.toString('base64'));
                
                //Display the chunks using the data URI format
              fileName = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
              userj = JSON.parse(JSON.stringify(user));

              Event.find({_id: {$in: user.planner}})
              .select('header_photo event_name _id date venue things')
              .exec(function(err, event) {
                if (err) res.send(err)
                else if(!event) {
                  // No event found
                  var params = {
                    layout: 'main',
                    user: userj,
                    image: fileName
                  }
                  //res.send(params)
                  res.render('planner', params)
                } else {
                  async.forEach(event, function(result,resultCallback) {
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
                      var data = eventList;
                      //Note: if adding the rendering part, pls dont forget to add the 'img' attribute 
                      // sa second parameter of the function below
                      const result = data.reduce((r, {date, event_name, _id, header_photo, img, venue, things}) => {
                      let dateObj = new Date(date);
                      let monthyear = dateObj.toLocaleString("en-us", { month: "long", year: 'numeric' });
                      if(!r[monthyear])
                        r[monthyear] = {monthyear, entries: [{date,event_name,_id, header_photo, img, venue, things}] }
                      else
                        r[monthyear].entries.push({date,event_name,_id, header_photo, img, venue, things});
                      return r;
                    }, {})

                    eventList = Object.keys(result).map(i => result[i])
                    
                    eventList.sort(dates1).forEach(function(e) {
                      console.log("")
                    });
                  
                    var print = JSON.parse(JSON.stringify(eventList))
                    var params = {
                      layout: 'main',
                      events: print,
                      user: userj,
                      image: fileName
                    }
                    res.render('planner',params)
                })
                  }
                })
              })
            }
          })
        }
      })
    }
};

exports.viewprofile = (req,res, next) => {    
    var userId = req.params.userId;
    var fileName = res.locals.photo;
    User.findById(userId)
            .populate('orgs.org_id','_id org_name org_logo')
            .exec( function(err,result) { 
                if (err) { res.send(err)
                } else if (!result)  {
                    // User not Found
                    res.redirect('/explore');
                } else {
                    collection.find({filename: result.photo}).toArray(function(err, docs){
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
                            var user = JSON.parse(JSON.stringify(result));
                            var bool = false;
                            if (req.user) {
                                if (req.session.passport.user == userId)
                                    bool = true;       
                            }
                            
                            var params = {
                                layout: 'main',
                                isUser: bool,
                                info:user,
                                image: finalFile
                            }
                            res.render('user-profile', params);  
                          });
                        }
                    } 
                )}
           
            });
};

exports.addtoplanner = (req, res) => {
    var userId = req.session.passport.user;
    var eventId = req.params.id

    Event.updateOne(
      {_id:eventId},
      {$inc:{current_cap:-1}},
      {multi:true},
      function(err, docs) {
        if(err) res.send(err)
        else if(!docs) res.send("No event found")
        else {
          var date = docs.date
        
          var new_event = {
            _id: mongoose.Types.ObjectId(eventId),
            date:date
          }
          User.updateOne(
            {_id: userId},
            {$push: {
              planner: new_event
              }
            },
            { "$upsert": true },
            function(err, result) {
              if(err) res.send(err)
              else if(!result) res.send("Nothing found")
              else {
                res.send("Successfully Added")
              }
            }
          )
        }
    })
}

exports.renderUser = (req, res) => {
      if (!req.isAuthenticated()) { 
        res.redirect('/');  
        } else {
        var fileName = res.locals.photo;
        var userId = req.session.passport.user;
        var orgList = [], user;
        User.findById(userId)
                .populate('orgs.org_id','_id org_name org_logo')
                .exec( function(err,result) { 
                    if (err) { res.send(err);
                    } else  {

                        collection.find({filename: fileName}).toArray(function(err, docs){
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
                                user = JSON.parse(JSON.stringify(result));
                                user.img = finalFile;

                                    async.forEach(result.orgs, function(result,resultCallback) {
                                      async.waterfall([ 
                                          function(callbackEach) {
                                              callbackEach(null, result);
                                          },
                                          function getImageFilname(org, callbackEach){
                                              collection.find({filename: org.org_id.org_logo}).toArray(function(err, docs){
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
                                              }
                                      ])
                                  }, function(err) { 
                                          var params = {
                                              layout: 'main',
                                              isUser: true,
                                              info: user,
                                              orgs: orgList
                                          };
                                        res.render('user-profile',params);
                                  })
                              });
                            }
                        } 
                    )}                           
            });
    }
}

exports.logout = function(req, res, next) {
    if (req.session) {
      // Delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
      // Logout from Google
      req.logout();
    }
};

exports.editprofiledetails = (req, res) =>{
    var userId = req.session.passport.user;
    if(!req.file){
    User.findByIdAndUpdate({_id: userId}, 
      {
      $set: {
        first_name: req.body.edit_fname,
        last_name: req.body.edit_lname,
        email_address: req.body.edit_email,
        short_bio: req.body.edit_bio
      }
      }, (err)=>{
        if(err){
          res.send(err);
        }
        else{
          res.redirect('/user-profile');
        }
      })
    }

   else{
    User.findByIdAndUpdate({_id: userId}, 
      {
      $set: {
        first_name: req.body.edit_fname,
        last_name: req.body.edit_lname,
        email_address: req.body.edit_email,
        photo: req.file.filename,
        short_bio: req.body.edit_bio
      }
      }, (err)=>{
        if(err){
          res.send(err);
        }
        else{
          res.redirect('/user-profile');
        }
      })
    }
}