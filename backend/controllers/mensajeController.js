// controllers/mensajeController.js
const Mensaje = require('../models/Mensaje');

exports.getMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.getAllMensajes();
    res.json(mensajes);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener mensajes." });
  }
};

exports.createMensaje = async (req, res) => {
  try {
    const id = await Mensaje.addMensaje(req.body);
    res.json({ msg: "Mensaje creado", id });
  } catch (e) {
    res.status(500).json({ msg: "Error al crear mensaje." });
  }
};
