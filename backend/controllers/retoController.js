// controllers/retoController.js
const Reto = require('../models/Reto');

exports.getRetos = async (req, res) => {
  try {
    const retos = await Reto.getAllRetos();
    res.json(retos);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener retos." });
  }
};

exports.createReto = async (req, res) => {
  try {
    const id = await Reto.addReto(req.body);
    res.json({ msg: "Reto creado", id });
  } catch (e) {
    res.status(500).json({ msg: "Error al crear reto." });
  }
};
