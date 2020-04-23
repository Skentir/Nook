const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController');

router.get('/planner', controller.viewplanner);

module.exports = router;