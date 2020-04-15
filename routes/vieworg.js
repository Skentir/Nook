const express = require('express');
const router = express.Router();

const OrgModel = require('../models/Org');

const controller = require('../controllers/orgsController');

router.get('/vieworg/:orgId', controller.vieworg);

module.exports = router;

