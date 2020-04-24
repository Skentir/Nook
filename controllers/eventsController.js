const EventModel = require('../models/Event');

exports.addevent = (req,res)=>{
    res.render('ad-eventreg');
};

exports.viewevents = (req,res)=>{
    var orgId = req.params.orgId;

    EventModel.find({'organizer_id':orgId}, {event_name:1, date:1})
        .exec(function(err, result) {
            if (err) {
                res.send(err);
            } else {
                var event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    events: event
                };
                res.render('ad-eventview', params);
            }
        });
};

exports.editevent = (req,res)=> {
    var eventId = req.params.eventId;
    
    EventModel.findById(eventId)
        .exec(function (err,result) {
            if (err) {
                res.send(err);
            } else if (!result) {
                // No event found
                res.redirect('/ad-tools');
            } else {
                event = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    event
                };
                res.render('editevent', params);
            }
        });
};

exports.viewevent = (req,res)=> {
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
};