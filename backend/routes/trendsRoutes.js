const express = require('express');
const router = express.Router();

const trends = ['#AI', '#WebDev', '#Startups', '#OpenSource', '#Design', '#React'];

router.get('/', (req, res) => {
  res.json(trends);
});

module.exports = router;
