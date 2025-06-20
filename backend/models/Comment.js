// models/Comment.js
const pool = require('../config/db');

// Obtener comentarios de un feed/post
async function getCommentsByFeed(feedId) {
  const [rows] = await pool.query(
    'SELECT * FROM comments WHERE feed_id = ? ORDER BY id ASC',
    [feedId]
  );
  return rows;
}

// Crear un comentario nuevo
async function addComment({ feed_id, username, avatar, comment, tiempo }) {
  const [result] = await pool.query(
    'INSERT INTO comments (feed_id, username, avatar, comment, tiempo) VALUES (?, ?, ?, ?, ?)',
    [feed_id, username, avatar, comment, tiempo]
  );
  return result.insertId;
}

module.exports = {
  getCommentsByFeed,
  addComment,
};
