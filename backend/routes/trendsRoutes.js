const express = require('express');
const router = express.Router();

const trends = [
  { name: '#AI' },
  { name: '#WebDev' },
  { name: '#Startups' },
  { name: '#OpenSource' },
  { name: '#Design' },
  { name: '#React' },
  { name: '#Cloud' },
  { name: '#DevOps' },
  { name: '#UX' },
];

router.get('/', (req, res) => {
  const data = trends.map((t) => ({
    ...t,
    count: Math.floor(Math.random() * 9000 + 1000),
    since: Math.floor(Math.random() * 24 + 1) + 'h',
  }));
  res.json(data);
});

module.exports = router;
