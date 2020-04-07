const mongoose = require('mongoose');
const Org = require('../models/Org.js');

const EventSchema = mongoose.Schema({
    event_id:{
        type: Number,
        required: false,
    },
    event_name:{
        type: String,
        required: true
    },

    header_photo:{
        type: String,
        required: false
    },

    tags:{
        type: [String],
        required: false
    },

    date:{
        type: Date,
        required: false,
    },

    start_time:{
        type : String,
        required: true
    },

    end_time :{
        type: String,
        required: true
    },

    about_desc:{
        type: String,
        required: true
    },

    venue:{
        type: String,
        required: true
    },

    capacity:{
        type: Number,
        required: true
    },

    things: {
        type: String,
        required: true
    },

    codes:{
        type: String,
        required: false,
    },

    incentives:{
        type: String,
        required: false
    },


    organizer_id: {
        type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Org'}]
    }

});

var collectionName = 'Events'
module.exports = mongoose.model('Event', EventSchema, collectionName);