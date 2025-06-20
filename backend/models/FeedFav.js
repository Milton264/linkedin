// models/FeedFav.js
const pool = require('../config/db');

async function addFav({ feed_id, username }) {
  await pool.query(
    'INSERT INTO feed_favs (feed_id, username) VALUES (?, ?)',
    [feed_id, username]
  );
}

async function getFavsByFeed(feedId) {
  const [rows] = await pool.query(
    'SELECT * FROM feed_favs WHERE feed_id = ? ORDER BY id ASC',
    [feedId]
  );
  return rows;
}

module.exports = {
  addFav,
  getFavsByFeed,
};
