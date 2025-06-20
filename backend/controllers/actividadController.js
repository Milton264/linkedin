// controllers/actividadController.js
const Actividad = require('../models/Actividad');

exports.getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.getAllActividades();
    res.json(actividades);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener actividades." });
  }
};

exports.createActividad = async (req, res) => {
  try {
    const id = await Actividad.addActividad(req.body);
    res.json({ msg: "Actividad creada", id });
  } catch (e) {
    res.status(500).json({ msg: "Error al crear actividad." });
  }
};
