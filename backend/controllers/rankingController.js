// controllers/rankingController.js
const Ranking = require('../models/Ranking');

exports.getRankings = async (req, res) => {
  try {
    const rankings = await Ranking.getAllRankings();
    res.json(rankings);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener ranking." });
  }
};

exports.createRanking = async (req, res) => {
  try {
    const id = await Ranking.addRanking(req.body);
    res.json({ msg: "Ranking creado", id });
  } catch (e) {
    res.status(500).json({ msg: "Error al crear ranking." });
  }
};
