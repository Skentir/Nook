const mongoose = require('mongoose');
const User = require('../models/User.js');
const Org = require('../models/Org.js');

const RequestSchema = mongoose.Schema({
    user_id: {
        type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },

    org_id: {
        type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Org'}]
    },

    status:{
        type: String
    },

    position:{
        type: String
    }
});

const collectionname = 'requests'
module.exports = mongoose.model('Request', RequestSchema, collectionname);