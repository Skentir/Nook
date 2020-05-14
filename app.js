/*Require packages*/

//Require and Execute Express
const express = require('express');
const app = express();

//Require Handlebar
const hbs = require('express-handlebars');
const Handlebars = require('handlebars');

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
    extended: false
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
        res.locals.photo = req.user.photo;
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


var requiresAdmin = function() {
    return [
      function(req, res, next) {
        if (req.user && req.user.isAdmin === true)
          next();
        else
          //res.status(401).send('Unauthorized');
          res.redirect('/explore');
      }
    ]
  };

//listen to port
const port = 3000;
initDb(function (err) {
    app.listen(port, function (err) {
        if (err) {
            throw err;
        }
    console.log("API Up and running on port " + port);
    //ROUTES
    //requires all admin routes to be validated with requiresAdmin function 
    app.all('/admin/*', requiresAdmin());
    app.use('/', require('./routes/landing'))
    app.use('/', require('./routes/explore'));
    app.use('/', require('./routes/editprofile'));
    app.use('/', require('./routes/planner'));
    app.use('/', require('./routes/userprofile'));
    app.use('/', require('./routes/vieworg'));
    app.use('/', require('./routes/viewevent'));
    app.use('/admin',require('./routes/admin'));


    });
});

