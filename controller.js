const getDb = require('./config/db').getDb;
const User = require('./models/User');

module.exports.renderUser = (req, res) => {
    const db = getDb();
      
      const collection = db.collection('uploads.files');
      const collectionChunks = db.collection('uploads.chunks');

      if (!req.isAuthenticated()) { 
        res.redirect('/');  
        } else {
        const fileName = res.locals.photo;
        var userId = req.session.passport.user;
        User.findById(userId)
                .populate('orgs.org_id','_id org_name org_logo')
                .exec( function(err,result) { 
                    if (err) { res.send(err);
                    } else  {

                        collection.find({filename: fileName}).toArray(function(err, docs){
                            console.log(docs._id + " id");
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
                                let fileData = [];
                                for(let i=0; i<chunks.length;i++){
                    
                                  //This is in Binary JSON or BSON format, which is stored
                                  //in fileData array in base64 endocoded string format
                                  fileData.push(chunks[i].data.toString('base64'));
                                }
                                //Display the chunks using the data URI format
                                let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
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