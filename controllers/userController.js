const getDb = require('../config/db').getDb;
const User = require('../models/User');
const Request = require('../models/Request');


const db = getDb();
      
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

exports.viewtools = (req,res)=> {
    /* TODO: GET ORG ID FROM USER */
    
    var obj = {
        _id : "5e8229291c9d4400009aa35f"
    }
    res.render('ad-tools', obj);
};

exports.editprofile = (req,res, next)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
        var userId = req.session.passport.user;
        var fileName = res.locals.photo;
        User.findById(userId)
        .exec(function (err,user) {
            if (err) {
                res.send(err);
            } else {
                Request.find({user_id: userId})
                .populate('org_id', '_id org_name org_logo')
                .exec(function (err,result) {
                    if (err) {
                        res.send(err);
                    } else if (!result) {
                        // No pending request found
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
                                var userr = JSON.parse(JSON.stringify(user));
                                var params = {
                                    layout: 'main',
                                    user_data: userr,
                                    image: finalFile
                                }
                                res.render('edit-profile', params);  
                              });
                            }
                        } 
                    )   
                    
                    } else {    collection.find({filename: fileName}).toArray(function(err, docs){
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
                            var userr = JSON.parse(JSON.stringify(user));
                            var reqs = JSON.parse(JSON.stringify(result));
                            var params = {
                                layout: 'main',
                                user_data: userr,
                                requests: reqs,
                                image: finalFile
                            }
                            res.render('edit-profile', params);  
                          });
                        }
                    } 
                )}      
                });
            }
        });
    }
};

exports.viewplanner = (req,res)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
    var userId = req.session.passport.user;
    var fileName = res.locals.photo;
    User.findById(userId)
            .populate('planner','_id event_name header_photo')
            .exec( function(err,result) { 
                if (err) { res.send(err)
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
                        var user = JSON.parse(JSON.stringify(result));
                        var params = {
                            layout: 'main',
                            info:user,
                            image: finalFile
                        }
                        res.render('planner', params);  
                      });
                    }
                } 
                )}                                             
            });
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


exports.renderUser = (req, res) => {
      if (!req.isAuthenticated()) { 
        res.redirect('/');  
        } else {
        var fileName = res.locals.photo;
        var userId = req.session.passport.user;
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
                                var user = JSON.parse(JSON.stringify(result));
                                var params = {
                                    layout: 'main',
                                    isUser: true,
                                    info:user,
                                    image: finalFile
                                }
                                res.render('user-profile', params);  
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