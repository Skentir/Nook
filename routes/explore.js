const express = require('express');
const router = express.Router();

const OrgModel = require('../models/Org');
const EventModel = require('../models/Event');

const controller = require('../controllers/exploreController');

router.get('/explore', controller.view);

module.exports = router;