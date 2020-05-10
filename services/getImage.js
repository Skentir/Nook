const getDb = require('../config/db').getDb;

const db = getDb();
const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');
function getImageLogo(result,callback){
    var finalFile;
    collection.find({filename: result.org_logo}).toArray(function(err, docs){
        if(err){
        return callback(err);
        }
        if(!docs || docs.length === 0){
        return callback(err);
        }else{
        //Retrieving the chunks from the db
        collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
            if(err){
            return callback(err);
            }
            if(!chunks || chunks.length === 0){
            //No data found
            return callback(err);
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
            arrays.push(finalFile);
        });
        }
    })
    return callback(null,finalFile);

}


function getImageChunks(res,result){
        collection.find({filename: result.org_logo}).toArray(async function(err, docs){
            if(err){
            return res.send(err);
            }
            if(!docs || docs.length === 0){
            return res.send("File not found");
            }else{
            //Retrieving the chunks from the db
            
            return collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray();
            }
        })
    

}



module.exports.getImageLogo = getImageLogo;
//module.exports.getImageChunks = getImageChunks;