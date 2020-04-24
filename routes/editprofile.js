const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController');

router.get('/editprofile', controller.editprofile);
module.exports = router;