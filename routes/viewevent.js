const express = require('express');
const router = express.Router();

const EventModel = require('../models/Event');

router.get('/viewevent/:eventId', (req,res)=> {
    const eventId = req.params.eventId;

    EventModel.findById(eventId)
        .populate('organizer_id', '_id org_name org_logo')
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // Event not Found
                res.redirect('/explore');
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    event
                  };
                res.render('viewevent', params);
            }
        });
});

module.exports = router;