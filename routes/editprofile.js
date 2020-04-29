const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController');
const requestsController = require('../controllers/requestsController');

router.get('/editprofile', controller.editprofile);
router.post('/editprofile', requestsController.createrequests);
module.exports = router;