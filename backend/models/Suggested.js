const pool = require('../config/db');

async function getAllSuggested() {
  const [rows] = await pool.query('SELECT * FROM suggested_users ORDER BY id DESC');
  return rows;
}

async function addSuggested({ username, avatar }) {
  const [result] = await pool.query(
    'INSERT INTO suggested_users (username, avatar) VALUES (?, ?)',
    [username, avatar]
  );
  return result.insertId;
}

module.exports = {
  getAllSuggested,
  addSuggested,
};
