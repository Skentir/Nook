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
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



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

//config
require('./config/passport')(passport);
const initDb = require("./config/db").initDb;
const getDb = require("./config/db").getDb;


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
    if (req.user) {
        res.locals.isAdmin = req.user.isAdmin; 
    }
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

//listen to port
const port = 3000;
initDb(function (err) {
    app.listen(port, function (err) {
        if (err) {
            throw err;
        }
    console.log("API Up and running on port " + port);
    //ROUTES
    app.use('/', require('./routes/landing'))
    app.use('/', require('./routes/explore'));
    app.use('/', require('./routes/editprofile'));
    app.use('/', require('./routes/planner'));
    app.use('/', require('./routes/userprofile'));
    app.use('/', require('./routes/vieworg'));
    app.use('/', require('./routes/viewevent'));


    //app.use('/', require('./ad-eventreg'));

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


    app.get('/ad-tools', (req,res)=> {
        /* TODO: GET ORG ID FROM USER */
        
        var obj = {
            _id : "5e8229291c9d4400009aa35f"
        }
        res.render('ad-tools', obj);
    })


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
                            //   res.json(params);
                            res.render('member-requests', params);
                            }
                        });
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

    /*post for event registration
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
    */  




    });
});

