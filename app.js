/*Require packages*/

//Require and Execute Express
const express = require('express');
const app = express();


//Require db models
const User = require('./models/User');
const EventModel = require('./models/Event');
const OrgModel = require('./models/Org');

//Require for parsing and storing data
const crypto = require("crypto");
const fs = require('fs');
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const bodyParser = require('body-parser');
const cors = require('cors');
const Grid = require('gridfs-stream');
const Handlebars = require('handlebars');


//Require Mongoose for DB
const mongoose = require('mongoose');
mongoose.set('debug', true);

//Require path for file
const path = require('path');

//Require dotenv for DB connection
require('dotenv/config');

//Require for user sessions
const passport = require('passport');
require('./scripts/passport')(passport);



/*Middlewares*/
//Serve the css files
app.use(express.static(__dirname+'/'))

//parsing
app.use(bodyParser.urlencoded({
    extended: false
 }));
 app.use(bodyParser.json());
 app.use(cors());

//user session
app.use(passport.initialize());
app.use(passport.session());
const hbs = require('express-handlebars');
app.set('view engine', 'hbs');

app.engine('hbs', hbs( {
  extname: 'hbs',  
  defaultView: 'default',  
  layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
  partialsDir: path.join(__dirname, '/views/partials'), // Partials folder

  helpers: {
    section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    'notNull' : function(value, options) {

        if(!Handlebars.Utils.isArray(value)){
            return [];
        } else {
            return value.filter(function(ele){
                return !Handlebars.Utils.isEmpty(ele);
            });
        }
    }
  }

}));


app.use(require("express-session")({    
    secret:"session",    
    resave: true,    
    saveUninitialized: true
}));



//Connect to DB
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


//ROUTES
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname + "/views/landing.html")); 
})

app.get('/landing',(req,res) =>{
    res.sendFile(path.join(__dirname + "/views/landing.html")); 
})

app.get('/ad-eventreg', (req,res)=>{
    res.render('ad-eventreg');
})
app.get('/ad-eventview', (req,res)=>{
    res.render('ad-eventview');
})

app.get('/explore', function(req, res) {
    OrgModel.find({}, {}, function(err, docs) {
    var objs=[];
        for (var i =0; i<docs.length; i++)
        {
            var obj = {
                fromDB:docs,
                org_id: docs[i]._id,
                org_type: docs[i].org_type,
                org_name: docs[i].org_name,
                org_logo:docs[i].org_logo
            }
            objs.push(obj);
        }
        res.render('explore', {
            title: 'Orgs',
            Orgs: objs,
        });
    });
});

app.get('/ad-tools', (req,res)=> {
    res.render('ad-tools');
})

app.get('/edit-profile', (req,res)=> {
    res.render( 'edit-profile');
})

app.get('/editorg', (req,res)=> {
    res.render( 'editorg');
})

app.get('/editevent', (req,res)=> {
    res.render( 'editevent');
})

app.get('/member-requests', (req,res)=> {
    res.render('member-requests');
});

app.get('/planner', (req,res)=> {
    res.render('planner');
});

app.get('/user-profile', (req,res)=> {
    res.render('user-profile');
    /*
        User.findOne({email: req.session.user.email})
            .populate("org_id")
            .then(function(user){
                res.render('user-profile', {
                    // insert needed contents for userprofile.hbs 
                
                });                              
            });
    */
});

app.get('/viewevent/:eventId', (req,res)=> {
    const eventId = req.params.eventId;

    EventModel.findById(eventId)
        .populate('organizer_id', '_id org_name org_logo')
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else {
                console.log(post);
                var event = JSON.parse(JSON.stringify(result));
                res.render('viewevent', event);
            }
        });
});

app.get('/vieworg/:orgId', (req,res)=> {
    const orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .populate('events', '_id event_name header_photo')
        .exec(function(err, result)  {
            if (err) {
                res.send(err);
              } else {        
                var org = JSON.parse(JSON.stringify(result));
                res.render('vieworg', org);       
            }
        });
});

app.get('/view-officers', (req,res)=> {
    res.render('view-officers');
});


//POST for user registration
app.post('/', upload.single('profilepic'), async (req,res)=> {
    console.log(req.body.reg_fname);
    console.log(req.file.filename);
    const user = new User({
        first_name : req.body.reg_fname,
        last_name: req.body.reg_lname,
        id_number: req.body.reg_idnum,
        year_level: req.body.reg_yrlevel,
        email_address: req.body.reg_email,
        password: req.body.reg_pass,
        photo: req.file.filename
    });
    try{
    await user.save((err, user)=>{
        if(err) return res.json(err);
        else res.send(user);
    });
        
    }
    catch(err){
        res.status(500).send("error message");
        console.log("error");
    }
});


//post for event registration
app.post('/ad-eventreg', upload.single('event_photo'), async(req,res)=>{
    console.log(req.body);
    
    const event = new EventModel({
      event_name: req.body.event_name,
      header_photo: req.file.filename,
      tags: req.body.event_tags,
      date: req.body.event_date,
      event_date: req.body.event_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      about_desc: req.body.event_about,
      things: req.body.things,
      capacity: req.body.capacity,
      codes: req.body.coursecodes,
    });
    try{
        await event.save((err, user)=>{
            if(err) return res.json(err);
            else res.send(event);
        });
            
        }
        catch(err){
            res.status(500).send("error message");
            console.log("error");
        }
});


app.post('/login', (req, res, next) => {
    passport.authenticate('local', {    
      successRedirect: '/explore',
      failureRedirect: '/',
    })(req, res, next);
  });
  

//listen to port
app.listen(3000);
