module.export = () => {
    const multer = require('multer');
    const crypto = require("crypto");
    const GridFsStorage = require("multer-gridfs-storage");
    const Grid = require('gridfs-stream');
    const mongoose = require('mongoose');

    
    const initDb = require("../config/db").initDb;
    const getDb = require("../config/db").getDb;
    let gfs; 
    

    var db = getDb();


    db.once('open', ()=>{
        //Init Stream
        gfs = Grid(db, mongoose.mongo);
        gfs.collection('uploads');
    })

    //create storage engine for user and event reg
    const storage = new GridFsStorage({
    db: db,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            //crypto to generate random names
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
            return reject(err);
            }
            //create filename
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
        });
    }
    });

    const upload = multer({storage: storage});


    return upload;
};