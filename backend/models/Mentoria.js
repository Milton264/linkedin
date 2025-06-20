// models/Mentoria.js
const pool = require('../config/db');

async function getAllMentorias() {
  const [rows] = await pool.query('SELECT * FROM mentorias ORDER BY id DESC');
  return rows;
}

async function addMentoria({ titulo, mentor, avatar, horario }) {
  const [result] = await pool.query(
    'INSERT INTO mentorias (titulo, mentor, avatar, horario) VALUES (?, ?, ?, ?)',
    [titulo, mentor, avatar, horario]
  );
  return result.insertId;
}

module.exports = {
  getAllMentorias,
  addMentoria,
};
