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


/*IMPORT ROUTES
const adminRoute = require('./routes/admin');

/MIDDLEWARES
app.use('/admin',adminRoute);
*/

//ROUTES
    
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname + "/html/landing.html")); 
})

app.get('/ad-eventreg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/ad-eventreg.html"));
})

app.get('/explore', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/explore.html"));
})

app.get('/ad-tools', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/ad-tools.html"));
})

app.get('/edit-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/edit-profile.html"));
})

app.get('/edit-org', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/edit-org.html"));
})

app.get('/member-requests', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/member-requests.html"));
})

app.get('/planner', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/planner.html"));
})

app.get('/user-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/user-profile.html"));
})

app.get('/viewevent', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/viewevent.html"));
})

app.get('/vieworg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/vieworg.html"));
})

app.get('/view-officers', (req,res)=>{
    res.sendFile(path.join(__dirname + "/html/view-officers.html"));
})


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true }, ()=>{
    console.log("connected to DB!")
})


app.listen(3000);
