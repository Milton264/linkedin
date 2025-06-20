const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, username, role, email, password } = req.body;
    let avatar = null;
    if (req.file) avatar = '/uploads/' + req.file.filename;

    const [userByMail] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (userByMail.length) return res.status(400).json({ msg: 'Email ya existe.' });
    const [userByUser] = await pool.query('SELECT id FROM users WHERE username=?', [username]);
    if (userByUser.length) return res.status(400).json({ msg: 'Usuario ya existe.' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, username, role, email, password, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, role, email, hash, avatar]
    );
    res.json({ id: result.insertId, name, username, email, avatar });
  } catch (e) {
  console.error("ERROR EN REGISTRO:", e);
  res.status(500).json({ msg: 'Error en registro.', error: e.message });
}

};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!users.length) return res.status(400).json({ msg: 'Credenciales incorrectas.' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: 'Credenciales incorrectas.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role, email: user.email, avatar: user.avatar }
    });
  } catch (e) {
  console.error("ERROR EN LOGIN:", e);
  res.status(500).json({ msg: 'Error en login.', error: e.message });
}

};

exports.profile = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, username, role, email, avatar FROM users WHERE id=?', [req.userId]);
    if (!users.length) return res.status(404).json({ msg: 'No existe el usuario.' });
    res.json(users[0]);
  } catch {
    res.status(500).json({ msg: 'Error al obtener perfil.' });
  }
};
