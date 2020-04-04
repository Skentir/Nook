const mongoose = require('mongoose');
const OrgModel = require('../models/Org.js');
//var passportLocalMongoose = require("passport-local-mongoose"); 
mongoose.set('debug', true);

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    id_number: {
        type: Number,
        required: true,
    },
    year_level:{
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false
    },
    password:{
        type: String,
        required: true,
    }, 

    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    
    planner :{
        type:[String],
        required: false
    },

    orgs : [{type: mongoose.Schema.Types.ObjectId, ref: 'Org'}],

    
});


//UserSchema.plugin(passportLocalMongoose);  
module.exports = mongoose.model('User', UserSchema);