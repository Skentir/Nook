const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const orgsController = require('../controllers/orgsController');
const userController = require('../controllers/userController');
const requestsController = require('../controllers/requestsController');

router.get('/ad-tools', userController.viewtools);
router.get('/ad-eventreg', eventsController.addevent);
router.get('/eventlist/:orgId', eventsController.viewevents);
router.get('/editorg/:orgId', orgsController.editorg);
router.get('/editevent/:eventId', eventsController.editevent);
router.get('/member-requests/:orgId', requestsController.viewrequests);
router.get('/view-officers/:orgId', orgsController.viewofficers);
router.get('/delete-request/:reqId', requestsController.deleterequest);

module.exports = router;