const Suggested = require('../models/Suggested');

exports.getSuggested = async (req, res) => {
  try {
    const users = await Suggested.getAllSuggested();
    res.json(users);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener sugerencias.' });
  }
};

exports.createSuggested = async (req, res) => {
  try {
    const id = await Suggested.addSuggested(req.body);
    res.json({ msg: 'Sugerencia creada', id });
  } catch (e) {
    res.status(500).json({ msg: 'Error al crear sugerencia.' });
  }
};
