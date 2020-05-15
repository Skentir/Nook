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
            .populate('org_id', '_id org_name org_logo').then(results=>{
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
            console.log("error")
        } else {
            var params = {
                layout: 'main',
                requests: reqList,
                user: userj
              }
            res.render('edit-profile',params);
            //res.send(params);
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

    function dates(event1, event2) {
      return event1.date - event2.date
    }

    User.findOne({_id:userId}, function(err, user) {
      user.planner.sort(dates).forEach(function(event) {
        console.log('event: ' + event.date)
      })
    })

    // User.findById(userId)
    //         .populate('planner','_id event_name header_photo')
    //         .exec( function(err,result) { 
    //             if (err) { res.send(err)
    //             } else  { 
    //                 collection.find({filename: fileName}).toArray(function(err, docs){
    //                 if(err){
    //                   return res.send(err);
    //                 }
    //                 if(!docs || docs.length === 0){
    //                   return res.send(err);
    //                 }else{
    //                   //Retrieving the chunks from the db
                      
    //                   collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
    //                     if(err){
    //                       return res.send(err);
    //                     }
    //                     if(!chunks || chunks.length === 0){
    //                       //No data found
    //                       return res.send(err);
    //                     }
    //                     //Append Chunks
    //                     var fileData = [];
    //                     for(let i=0; i<chunks.length;i++){
            
    //                       //This is in Binary JSON or BSON format, which is stored
    //                       //in fileData array in base64 endocoded string format
    //                       fileData.push(chunks[i].data.toString('base64'));
    //                     }
    //                     //Display the chunks using the data URI format
    //                     var finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
    //                     var user = JSON.parse(JSON.stringify(result));
    //                     var params = {
    //                         layout: 'main',
    //                         info:user,
    //                         image: finalFile
    //                     }
    //                     res.render('planner', params);  
    //                   });
    //                 }
    //             } 
    //             )}                                             
    //         });
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
    var eventId = mongoose.Types.ObjectId(req.params.id)

    Event.findOne({_id:eventId}, function(err, docs) {
      if(err) res.send(err)
      else {
        var date = docs.date
      
        var new_event = {
          _id:eventId,
          date:date
        }
        
        User.updateOne(
          {_id: userId},
          {$addToSet: {planner: new_event}},
          function(err, result) {
            if(err) res.send(err)
            else {
              res.send('add-to-planner')
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
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
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
          console.log("here");
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
          console.log("here");
          res.send(err);
        }
        else{
          res.redirect('/user-profile');
        }
      })
    }
}