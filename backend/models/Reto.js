// models/Reto.js
const pool = require('../config/db');

async function getAllRetos() {
  const [rows] = await pool.query('SELECT * FROM retos ORDER BY id DESC');
  return rows;
}

async function addReto({ title, description, dificultad, xp }) {
  const [result] = await pool.query(
    'INSERT INTO retos (title, description, dificultad, xp) VALUES (?, ?, ?, ?)',
    [title, description, dificultad, xp]
  );
  return result.insertId;
}

module.exports = {
  getAllRetos,
  addReto,
};
