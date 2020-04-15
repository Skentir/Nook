const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Request = require('../models/Request');

const controller = require('../controllers/userController');

router.get('/editprofile', controller.editprofile);

module.exports = router;