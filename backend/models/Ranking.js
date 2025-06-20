// models/Ranking.js
const pool = require('../config/db');

async function getAllRankings() {
  const [rows] = await pool.query('SELECT * FROM rankings ORDER BY position ASC');
  return rows;
}

async function addRanking({ username, avatar, xp, position }) {
  const [result] = await pool.query(
    'INSERT INTO rankings (username, avatar, xp, position) VALUES (?, ?, ?, ?)',
    [username, avatar, xp, position]
  );
  return result.insertId;
}

module.exports = {
  getAllRankings,
  addRanking,
};
