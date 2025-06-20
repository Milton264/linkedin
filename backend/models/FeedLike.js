// models/FeedLike.js
const pool = require('../config/db');

async function addLike({ feed_id, username }) {
  await pool.query(
    'INSERT INTO feed_likes (feed_id, username) VALUES (?, ?)',
    [feed_id, username]
  );
}

async function getLikesByFeed(feedId) {
  const [rows] = await pool.query(
    'SELECT * FROM feed_likes WHERE feed_id = ? ORDER BY id ASC',
    [feedId]
  );
  return rows;
}

module.exports = {
  addLike,
  getLikesByFeed,
};
