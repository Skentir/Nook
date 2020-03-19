const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    event_id:{
        type: Number,
        required: true
    },
    event_name:{
        type: String,
        required: true
    },

    header_photo:{
        type: Buffer,
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

    things:{
        type: String,
        required: true
    },

    organizer_id:{
        type : ObjectId,
        ref: 'Org'
    }

});


module.exports = mongoose.model('Event', EventSchema);