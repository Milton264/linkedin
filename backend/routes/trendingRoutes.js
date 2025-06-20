const express = require('express');
const router = express.Router();
const trendingController = require('../controllers/trendingController');

router.get('/', trendingController.getTrending);

module.exports = router;
