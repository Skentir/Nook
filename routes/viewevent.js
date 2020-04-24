const express = require('express');
const router = express.Router();

const controller = require('../controllers/eventsController');

router.get('/viewevent/:eventId', controller.viewevent);

module.exports = router;