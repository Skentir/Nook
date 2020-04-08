const express = require('express');
const router = express.Router();

const OrgModel = require('../models/Org');

router.get('/vieworg/:orgId', (req,res) => {
    const orgId = req.params.orgId;

    OrgModel.findById(orgId)
        .populate('events', '_id event_name header_photo')
        .exec(function(err, result)  {
            if (err) {
                res.send(err);
              } else  if (!result) {
                // Org not Found
                res.redirect('/explore')
              } else {        
                var org = JSON.parse(JSON.stringify(result));
                var params = {
                    layout: 'main',
                    org
                  };
                res.render('vieworg', params);       
            }
        });
});

module.exports = router;

