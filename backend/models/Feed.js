// models/Feed.js
const pool = require('../config/db');

// Obtener todos los feeds (paginación opcional)
async function getFeedsPaginated(page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;
  const [rows] = await pool.query(
    'SELECT * FROM feeds ORDER BY tiempo DESC LIMIT ? OFFSET ?',
    [perPage, offset]
  );
  const [totalRes] = await pool.query('SELECT COUNT(*) AS total FROM feeds');
  return { rows, total: totalRes[0].total };
}

async function getAllFeeds() {
  const [rows] = await pool.query('SELECT * FROM feeds ORDER BY tiempo DESC');
  return rows;
}

async function addFeed({ username, avatar, mensaje, tiempo }) {
  const [result] = await pool.query(
    'INSERT INTO feeds (username, avatar, mensaje, tiempo) VALUES (?, ?, ?, ?)',
    [username, avatar, mensaje, tiempo]
  );
  return result.insertId;
}

async function updateFeed(id, mensaje) {
  await pool.query('UPDATE feeds SET mensaje = ? WHERE id = ?', [mensaje, id]);
}

async function deleteFeed(id) {
  await pool.query('DELETE FROM feeds WHERE id = ?', [id]);
}

module.exports = {
  getFeedsPaginated,
  getAllFeeds,
  addFeed,
  updateFeed,
  deleteFeed,
};
