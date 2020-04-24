const express = require('express');
const router = express.Router();

const controller = require('../controllers/exploreController');

router.get('/explore', controller.view);

module.exports = router;