// models/Project.js
const pool = require('../config/db');

async function getAllProjects() {
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY id DESC');
  return rows;
}

async function addProject({ name, description, technologies, stars, image }) {
  const [result] = await pool.query(
    'INSERT INTO projects (name, description, technologies, stars, image) VALUES (?, ?, ?, ?, ?)',
    [name, description, technologies, stars, image]
  );
  return result.insertId;
}

module.exports = {
  getAllProjects,
  addProject,
};
