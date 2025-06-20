// controllers/mentoriaController.js
const Mentoria = require('../models/Mentoria');

exports.getMentorias = async (req, res) => {
  try {
    const mentorias = await Mentoria.getAllMentorias();
    res.json(mentorias);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener mentorías." });
  }
};

exports.createMentoria = async (req, res) => {
  try {
    const id = await Mentoria.addMentoria(req.body);
    res.json({ msg: "Mentoría creada", id });
  } catch (e) {
    res.status(500).json({ msg: "Error al crear mentoría." });
  }
};
