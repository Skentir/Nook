const express = require('express');

const router = express.Router();
const passport = require('passport');

const User = require('../models/User');
const bcrypt = require('bcryptjs');

const multer = require('multer');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');


const client = mongoose.connect('mongodb+srv://testboy:nooktestboy@cluster0-pym8a.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    if(mongoose.connection.readyState == 1);
    {   
        console.log("connected to DB! " +  mongoose.connection.readyState);
    }
   
})

let gfs; 

var db = mongoose.connection;

db.once('open', ()=>{
    //Init Stream
    gfs = Grid(db, mongoose.mongo);
    gfs.collection('uploads');
})

//create storage engine for user and event reg
const storage = new GridFsStorage({
  db: client,
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

router.get('/',(req,res) =>{
    var params = {
        layout: 'simple',
      };
    res.render('landing', params); 
});


//login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
  successRedirect: '/explore',
  failureRedirect: '/',
  })(req, res, next);
});

//register
router.post('/', upload.single('profilepic'), (req,res)=> {
  User.findOne({ email_address: req.body.reg_email})
  .then( userr => {
      if(userr){
          console.log("user exists");
      }
      else{
          const user = new User({
              first_name : req.body.reg_fname,
              last_name: req.body.reg_lname,
              id_number: req.body.reg_idnum,
              year_level: req.body.reg_yrlevel,
              email_address: req.body.reg_email,
              password: req.body.reg_pass,
              photo: req.file.filename
          });

          console.log(user.first_name);

          bcrypt.genSalt(10, (err, salt) => 
              bcrypt.hash(user.password, salt, (err, hash) => {
                  if(err) throw err;
                  // Hashed password
                  user.password = hash;
                  user.save()
                  .then(acct => {
                      res.redirect('/');
                  })
                  .catch(err => console.log(err));
              }))
      }
  })
});


module.exports = router;