const mongoose = require('mongoose');
require('mongoose-type-url');
require('mongoose-type-email');

const OrgSchema = new mongoose.Schema({
    org_id :{
        type: String,
        required : true
    },

    org_type:{
        type: String,
        required: true
    },

    org_name:{
        type : String,
        required : true
    },

    tagline:{
        type: String,
        required : false
    },

    tags:{
        type :[String],
        required: false
    },

    about_desc:{
        type: String,
        required: true
    },

    join_desc:{
        type: String,
        required: true
    },

    org_logo:{
        type: String,
        required: true
    },

    org_header:{
        type: String,
        required : true
    },

    date_established:{
        type:Date,
        required: false
    },

    no_of_officers:{
        type: Number,
        required: true,
        default :0
    },

    no_of_members:{
        type:Number,
        required: true,
        default: 0
    },

    email:{
        type: String,
        required: false,
    },

    form_url :{type: String, required: true},
    fb_url:{type: String, required: true},
    ig_url: {type: String, required: true},
    
    events:[{type:mongoose.Schema.Types.ObjectId, ref: 'Event'}],

    officers:[{type:mongoose.Schema.Types.ObjectId, ref: 'User'}]



});

var collectionName = 'Orgs'
module.exports = mongoose.model('Org', OrgSchema, collectionName);


