const Trending = require('../models/Trending');

exports.getTrending = async (req, res) => {
  try {
    const tags = await Trending.getAllTrending();
    res.json(tags);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener tendencias.' });
  }
};

exports.createTrending = async (req, res) => {
  try {
    const id = await Trending.addTrending(req.body);
    res.json({ msg: 'Tendencia creada', id });
  } catch (e) {
    res.status(500).json({ msg: 'Error al crear tendencia.' });
  }
};
