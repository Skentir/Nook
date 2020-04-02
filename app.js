//Require and Execute Express
const express = require('express');
const app = express();

//Require Mongoose for DB
const mongoose = require('mongoose');

//Require path for file
const path = require('path');

//Require dotenv for DB connection
require('dotenv/config');

//Serve the css files
app.use(express.static(__dirname+'/'))

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
    }
  }

}));


/*IMPORT ROUTES
const adminRoute = require('./routes/admin');

/MIDDLEWARES
app.use('/admin',adminRoute);
*/

//ROUTES
    
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname + "/views/landing.html")); 
})

app.get('/landing',(req,res) =>{
    res.sendFile(path.join(__dirname + "/views/landing.html")); 
})

app.get('/ad-eventreg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/ad-eventreg.html"));
})
app.get('/ad-eventview', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/ad-eventview.html"));
})
app.get('/explore', (req,res)=>{
    res.render('explore');
})

app.get('/ad-tools', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/ad-tools.html"));
})

app.get('/edit-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/edit-profile.html"));
})

app.get('/editorg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/editorg.html"));
})

app.get('/editevent', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/editevent.html"));
})

app.get('/member-requests', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/member-requests.html"));
})

app.get('/planner', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/planner.html"));
})

app.get('/user-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/user-profile.html"));
})

app.get('/viewevent', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/viewevent.html"));
})

app.get('/vieworg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/vieworg.html"));
})

app.get('/view-officers', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/view-officers.html"));
})


//Connect to DB
const client = mongoose.connect('mongodb+srv://testboy:nooktestboy@cluster0-pym8a.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
        console.log("connected to DB! " +  mongoose.connection.readyState);
})


app.listen(3000);
