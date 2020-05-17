const express = require('express');
const router = express.Router();

const controller = require('../controllers/exploreController');

router.get('/explore', controller.view);
router.get('/search-results', controller.searchOrg)
router.get('/get-org-list', controller.getOrgNames)

module.exports = router;