const express = require('express');
const router = express.Router();
const suggestedController = require('../controllers/suggestedController');

router.get('/', suggestedController.getSuggested);

module.exports = router;
