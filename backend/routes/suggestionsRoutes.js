const express = require('express');
const router = express.Router();

const people = [
  { name: 'Ana Gómez', avatar: '' },
  { name: 'Luis Pérez', avatar: '' },
  { name: 'María Sánchez', avatar: '' },
  { name: 'Carlos Ruiz', avatar: '' },
  { name: 'Patricia López', avatar: '' },
];

router.get('/', (req, res) => {
  res.json(people);
});

module.exports = router;
