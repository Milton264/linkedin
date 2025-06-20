// models/Mensaje.js
const pool = require('../config/db');

async function getAllMensajes() {
  const [rows] = await pool.query('SELECT * FROM mensajes ORDER BY id DESC');
  return rows;
}

async function addMensaje({ username, avatar, online, mensaje }) {
  const [result] = await pool.query(
    'INSERT INTO mensajes (username, avatar, online, mensaje) VALUES (?, ?, ?, ?)',
    [username, avatar, online, mensaje]
  );
  return result.insertId;
}

module.exports = {
  getAllMensajes,
  addMensaje,
};
