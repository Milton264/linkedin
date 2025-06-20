const pool = require('../config/db');

async function getAllTrending() {
  const [rows] = await pool.query('SELECT * FROM trending ORDER BY count DESC');
  return rows;
}

async function addTrending({ tag, count }) {
  const [result] = await pool.query(
    'INSERT INTO trending (tag, count) VALUES (?, ?)',
    [tag, count]
  );
  return result.insertId;
}

module.exports = {
  getAllTrending,
  addTrending,
};
