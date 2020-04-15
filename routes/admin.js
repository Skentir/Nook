const express = require('express');
const router = express.Router();

const User = require('../models/User');
const EventModel = require('../models/Event');
const OrgModel = require('../models/Org');
const Request = require('../models/Request');

const eventsController = require('../controllers/eventsController');
const exploreController = require('../controllers/exploreController');
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

module.exports = router;