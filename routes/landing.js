const express = require('express');

const router = express.Router();
const passport = require('passport');

const User = require('../models/User');
const OrgModel= require('../models/Org');
const bcrypt = require('bcryptjs');
const path = require('path');

const controller = require('../controllers/landingController');

const multer = require('multer');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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

function objectToArray(obj) {
  var array = [];
  for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
          array.push(obj[prop]);
      }
  }
  return array;
}

router.get('/',(req,res) => {
  OrgModel.find({})
    .select('-_id org_name')
    .exec( function(err, result) { 
      if (err) { res.send(err); }
      else {
        
        var resu = JSON.stringify(result).split(",");
        var array = [];
        for (var i=1; i < resu.length; i++) {
          array.push(resu[i].substring(13, resu[i].length-2));
        }

        var params = {
          layout: 'simple',
          result,
          org_list: array,
          clientID: process.env.GOOGLE_CLIENT_ID
        };
        res.render('landing', params); 
      }
    });
});


//login
router.post('/login', controller.login);

//register
router.post('/', upload.single('profilepic'), controller.register);


module.exports = router;