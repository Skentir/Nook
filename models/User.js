const mongoose = require('mongoose');
const Org = require('../models/Org.js');
//var passportLocalMongoose = require("passport-local-mongoose"); 
mongoose.set('debug', true);

/*var orgInfoSchema = new mongoose.Schema({
    org_id: {type: mongoose.Schema.Types.ObjectId, ref:'Org'},
    position: {type: String }, { noId: true },
});*/
/*var orgInfoSchema = new mongoose.Schema({ org_id: mongoose.Schema.Types.ObjectId, 
    position: String}, { noId: true });
*/

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
    short_bio: {
        type: String
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
        type:[{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
        required: false
    },

    orgs : [{
        org_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Org'
        },
        position: String,
    },{noId:true}],

    
});


//UserSchema.plugin(passportLocalMongoose);  
module.exports = mongoose.model('User', UserSchema);