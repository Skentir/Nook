const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
    },

    org_id: {
        type: ObjectId,
    },

    status:{
        type: Boolean
    },

    position:{
        type: String
    }
});

module.exports = mongoose.model('Request', RequestSchema);