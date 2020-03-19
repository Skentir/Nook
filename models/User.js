const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
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
    email_address: {
        type: String,
        required: true,
    },
    photo: {
        type:Buffer
    },
    password:{
        type: String,
        required: true,
    }, 

    isAdmin: {
        type: Boolean,
    },
    
    planner :{
        type:[String],
    },

    orgs : [{type:ObjectId, ref: "Org"}],

    
});

module.exports = mongoose.model('User', UserSchema);