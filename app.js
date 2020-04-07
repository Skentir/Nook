/*Require packages*/

//Require and Execute Express
const express = require('express');
const app = express();

//Require Handlebar
const hbs = require('express-handlebars');
const Handlebars = require('handlebars');

//Require db models
const User = require('./models/User');
const EventModel = require('./models/Event');
const OrgModel = require('./models/Org');
const Request = require('./models/Request');

//Require for parsing and storing data
const crypto = require("crypto");
const fs = require('fs');
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Grid = require('gridfs-stream');
const bcrypt = require('bcryptjs');

// Require for DateTime Formatting
const moment = require('moment');


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
const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(bodyParser.urlencoded({
    extended: true
 }));
 app.use(bodyParser.json());
 //app.use(cors());

// User session

app.use(cookieParser("session"));
app.use(require("express-session")({    
    secret:"session",    
    resave: true,    
    saveUninitialized: true,
    cookie: {
	    httpOnly: true,
	    expires: cookieExpirationDate
	}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

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
    'notNull': function(value, options) {

        if(!Handlebars.Utils.isArray(value)){
            return [];
        } else {
            return value.filter(function(ele){
                return !Handlebars.Utils.isEmpty(ele);
            });
        }
    },
    'formatToYear': function(dateTime) {
        return moment(dateTime).format('YYYY');
    },
    'formatDate': function(dateTime) {
        return moment(dateTime).format('MMMM DD, YYYY');
    }
  }

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
    var params = {
        layout: 'simple',
      };
    res.render('landing', params); 
})

app.get('/ad-eventreg', (req,res)=>{
    res.render('ad-eventreg');
})
app.get('/eventlist/:orgId', (req,res)=>{
    var orgId = req.params.orgId;

    EventModel.find({'organizer_id':orgId}, {event_name:1, date:1})
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    events: event
                  };
                res.render('ad-eventview', params);
            }
        });
})

app.get('/explore', function(req, res) {
    OrgModel.find({})
        .select('_id type org_logo org_name')
        .exec( function(err, docs) {
            if (err) {
                res.send(err);
            } else {
                EventModel.find({})
                    .select('_id event_name header_photo')
                    .limit(5)
                    .exec( function(err, result) {
                        if (err) {
                            res.send(err);
                        } else if (!result) {
                            var org = JSON.parse(JSON.stringify(docs));
                            var params = {
                                layout: 'main',
                                orgs: org
                            };
                            res.render('explore', params);
                        } else {
                            var org = JSON.parse(JSON.stringify(docs));
                            var event = JSON.parse(JSON.stringify(result));
                            var params = {
                                layout: 'main',
                                orgs: org,
                                events: event
                            };
                            res.render('explore', params);
                        }
                    });
            }
        });

});

app.get('/ad-tools', (req,res)=> {
    /* TODO: GET ORG ID FROM USER */
    
    var obj = {
        _id : "5e8229291c9d4400009aa35f"
    }
    res.render('ad-tools', obj);
})

app.get('/editprofile', (req,res, next)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
        var userId = req.session.passport.user;
        
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
                        var users = JSON.parse(JSON.stringify(user));
                        var params = {
                            layout: 'main',
                            user_data: users,
                        };
                        res.render('edit-profile', params);
                    } else {
                        var users = JSON.parse(JSON.stringify(user));
                        var reqs = JSON.parse(JSON.stringify(result));
                        var params = {
                            layout: 'main',
                            user_data: users,
                            requests: reqs
                        };
                        res.render('edit-profile', params);
                    }
                });
            }
        });
    }
});

app.get('/editorg/:orgId', (req,res)=> {
    var orgId = req.params.orgId;
    /* TODO: Get req.user.email from session or the id */
    OrgModel.findById(orgId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                res.redirect('/ad-tools');
            } else {
                var org = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    org
                  };
                res.render('editorg', params);
            }
        });
})

app.get('/editevent/:eventId', (req,res)=> {
    var eventId = req.params.eventId;
    
    EventModel.findById(eventId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // No event found
                res.redirect('/ad-tools');
            } else {
                event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    event
                  };
                res.render('editevent', params);
            }
        });
})

app.get('/member-requests/:orgId', (req,res)=> {
    var orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .select('tags org_name org_logo no_of_members no_of_officers')
        .exec(function (err, docs) {
            if (err) { res.send(err) 
            } else if (!docs) { 
                res.redirect('/ad-tools'); // Org Not Found
            } else {
                Request.find({org_id: docs._id})
                    .select('position')
                    .populate('user_id', '_id photo id_number first_name last_name')
                    .exec(function (err, result) {
                        if (err) { res.send(err) 
                        } else if (!result) {
                            // Request not found, send org data
                            var orgs = JSON.parse(JSON.stringify(docs));
                            var params = {
                                layout: 'main',
                                org: orgs
                            }
                            res.render('member-requests', params);
                        } else {
                            var orgs = JSON.parse(JSON.stringify(docs));
                            var request = JSON.parse(JSON.stringify(result));
                            var params = {
                                layout: 'main',
                                reqs:request,
                                org: orgs
                            }
                            res.render('member-requests', params);
                        }
                    });
            }
        });
});

app.get('/planner', (req,res)=> {
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
    var userId = req.session.passport.user;
    User.findById(userId)
            .populate('planner','_id event_name header_photo')
            .exec( function(err,result) { 
                if (err) { res.send(err)
                } else  {
                    var user = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main',
                        info:user
                    }
                    res.render('planner', params);   
                }                           
            });
    }
});

// View User Profile
app.get('/user-profile', (req,res, next) => {    
    if (!req.isAuthenticated()) { 
        res.redirect('/');  
    } else {
        var userId = req.session.passport.user;
        User.findById(userId)
                .populate('orgs.org_id','_id org_name org_logo')
                .exec( function(err,result) { 
                    if (err) { res.send(err);
                    } else  {
                    var user = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main',
                        isUser: true,
                        info:user
                    }
                    res.render('user-profile', params);   
                    }                           
                });
    }
});

// View Profile
app.get('/user-profile/:userId', (req,res, next) => {    
    var userId = req.params.userId;
    User.findById(userId)
            .populate('orgs.org_id','_id org_name org_logo')
            .exec( function(err,result) { 
                if (err) { res.send(err)
                } else if (!result)  {
                    // User not Found
                    res.redirect('/explore');
                } else {
                    var user = JSON.parse(JSON.stringify(result));
                    // Goes to user profile
                    var bool = false;
                    if (req.user) {
                        if (req.session.passport.user == userId)
                            bool = true;       
                    }
                    
                    var params = {
                        layout: 'main',
                        isUser: bool,
                        info:user
                    }
                    res.render('user-profile', params);   
                }                           
            });
});

app.get('/viewevent/:eventId', (req,res)=> {
    const eventId = req.params.eventId;

    EventModel.findById(eventId)
        .populate('organizer_id', '_id org_name org_logo')
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // Event not Found
                res.redirect('/explore');
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    event
                  };
                res.render('viewevent', params);
            }
        });
});

app.get('/vieworg/:orgId', (req,res) => {
    const orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .populate('events', '_id event_name header_photo')
        .exec(function(err, result)  {
            if (err) {
                res.send(err);
              } else  if (!result) {
                // Org not Found
                res.redirect('/explore')
              } else {        
                var org = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    org
                  };
                res.render('vieworg', params);       
            }
        });
});

app.get('/view-officers/:orgId', (req,res)=> {
    const orgId = req.params.orgId;

    OrgModel.find({'_id':orgId}, {'org_id':orgId})
    .select('org_name org_logo tags no_of_officers no_of_members date_established')
    .limit(1)
    .exec(function(err, org)  {
        if (err) {
            res.send(err);
          } else {        

           User.find({'orgs.org_id':orgId}, { 'orgs.position': { $ne: null } })
            .select('_id photo first_name last_name orgs.position')
            .exec(function(err, result)  {
                if (err) {
                    res.send(err);
                } else if (!result) {
                    // No officers found, return org data
                    var orgs = JSON.parse(JSON.stringify(org));
                    var params = {
                        layout: 'main', 
                        org_data: orgs
                    };
                   res.render('view-officers', params);
                } else {       
                    var orgs = JSON.parse(JSON.stringify(org));
                    var officer = JSON.parse(JSON.stringify(result));
                    var params = {
                        layout: 'main', 
                        org_data: orgs,
                        officers: officer
                        }
                    };
                    res.render('view-officers', params);
            }); 
        }
    }); 
});


//POST for user registration
app.post('/', upload.single('profilepic'), (req,res)=> {
    /*console.log(req.body.reg_fname);
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
    }*/
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
