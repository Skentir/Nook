const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController');
const reqController = require('../controllers/requestsController');
const multer = require('multer');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const bodyParser = require('body-parser');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const path = require('path');
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

router.get('/editprofile', controller.editprofile);
router.post('/edit-profile', upload.single('edit_pic'), controller.editprofiledetails);
router.post('/edit-profile/create-request', reqController.createrequests);
router.delete('/editprofile', reqController.cancelrequest);
router.delete('/cancel-request/:reqId', reqController.cancelrequest);

module.exports = router;