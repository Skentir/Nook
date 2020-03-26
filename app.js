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
    res.sendFile(path.join(__dirname + "/views/layouts/landing.html")); 
})

app.get('/landing',(req,res) =>{
    res.sendFile(path.join(__dirname + "/views/layouts/landing.html")); 
})

app.get('/ad-eventreg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/ad-eventreg.html"));
})

app.get('/explore', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/explore.html"));
})

app.get('/ad-tools', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/ad-tools.html"));
})

app.get('/edit-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/edit-profile.html"));
})

app.get('/edit-org', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/edit-org.html"));
})

app.get('/member-requests', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/member-requests.html"));
})

app.get('/planner', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/planner.html"));
})

app.get('/user-profile', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/user-profile.html"));
})

app.get('/viewevent', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/viewevent.html"));
})

app.get('/vieworg', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/vieworg.html"));
})

app.get('/view-officers', (req,res)=>{
    res.sendFile(path.join(__dirname + "/views/layouts/view-officers.html"));
})


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true }, ()=>{
    console.log("connected to DB!")
})


app.listen(3000);
