const getImage =require('./getImage');
async function readImageChunks(res,doc){
    try{
        var chunks = await getImage.getImageLogo(res,doc);
        var fileData = [];
        for(let i=0; i<chunks.length;i++){

        //This is in Binary JSON or BSON format, which is stored
        //in fileData array in base64 endocoded string format
            fileData.push(chunks[i].data.toString('base64'));
        }
        //Display the chunks using the data URI format
        var finalFile = 'data:' + docs.contentType + ';base64,' + fileData.join('');
        console.log("scanned and read")
        return finalFile;
    }catch(err){
        console.log("error");
    }
}

module.exports.readImageChunks = readImageChunks;