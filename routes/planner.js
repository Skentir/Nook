const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController');

router.get('/planner', controller.viewplanner);
router.post('/add-to-planner/:id', controller.addtoplanner);

module.exports = router;