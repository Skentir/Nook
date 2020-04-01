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
    res.sendFile(path.join(__dirname + "/views/explore.html"));
})

app.get('/ad-tools', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/ad-tools.html"));
})

app.get('/edit-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/edit-profile.html"));
})

app.get('/edit-org', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/edit-org.html"));
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
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true }, ()=>{
    console.log("connected to DB!")
})


app.listen(3000);
