const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    user_id: {
        type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },

    org_id: {
        type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Org'}]
    },

    status:{
        type: Boolean
    },

    position:{
        type: String
    }
});

module.exports = mongoose.model('Request', RequestSchema);