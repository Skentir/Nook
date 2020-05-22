const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const orgsController = require('../controllers/orgsController');
const userController = require('../controllers/userController');
const requestsController = require('../controllers/requestsController');
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

router.get('/ad-tools', userController.viewtools);
router.get('/ad-eventreg/:orgId', eventsController.addevent);
router.get('/eventlist/:orgId', eventsController.viewevents);
router.get('/editorg/:orgId', orgsController.editorg);
router.get('/editevent/:eventId', eventsController.editevent);
router.get('/member-requests/:orgId', requestsController.viewrequests);
router.get('/view-officers/:orgId', orgsController.viewofficers);
router.delete('/delete-request/:reqId', requestsController.cancelrequest);
router.put('/accept-request/:reqId', requestsController.acceptrequest);
router.post('/editorg/:orgId',upload.single('edit_org_header'), orgsController.editorgdetails);
router.post('/editevent/:eventId', upload.single('edit_event_photo'), eventsController.editeventdetails);
router.post('/ad-eventreg/:orgId', upload.single('event_photo'),eventsController.createevent);
router.delete('/delete-event/:id', eventsController.deleteevent);
module.exports = router;