const express = require('express');
const router = express.Router();

const people = [
  {
    name: 'Ana Gómez',
    avatar: '/uploads/avatars/ana.jpg',
    title: 'Ingeniera de Datos'
  },
  {
    name: 'Luis Pérez',
    avatar: '/uploads/avatars/luis.jpg',
    title: 'Product Designer'
  },
  {
    name: 'María Sánchez',
    avatar: '/uploads/avatars/maria.jpg',
    title: 'Frontend Dev'
  },
  {
    name: 'Carlos Ruiz',
    avatar: '/uploads/avatars/carlos.jpg',
    title: 'DevOps Engineer'
  },
  {
    name: 'Patricia López',
    avatar: '/uploads/avatars/patricia.jpg',
    title: 'QA Analyst'
  },
];

router.get('/', (req, res) => {
  res.json(people);
});

module.exports = router;
