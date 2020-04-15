const express = require('express');
const router = express.Router();

const EventModel = require('../models/Event');

const controller = require('../controllers/eventsController');

router.get('/viewevent/:eventId', controller.viewevent);

module.exports = router;