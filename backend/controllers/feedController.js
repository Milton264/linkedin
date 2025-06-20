const Feed = require('../models/Feed');

// GET /api/feed?page=1&perPage=10
exports.getFeed = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    const { rows, total } = await Feed.getFeedsPaginated(page, perPage);
    res.json({
      total,
      page,
      perPage,
      posts: rows,
    });
  } catch (err) {
    console.error("ERROR EN GET FEED:", err);
    res.status(500).json({ msg: 'Error al obtener feed.' });
  }
};

// POST /api/feed
exports.createFeed = async (req, res) => {
  try {
    // DEBUG
    console.log("BODY:", req.body);

    const { username, avatar, mensaje } = req.body;
    const tiempo = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (!mensaje || !username) return res.status(400).json({ msg: 'Faltan campos obligatorios.' });

    const id = await Feed.addFeed({ username, avatar, mensaje, tiempo });
    res.json({ id, username, avatar, mensaje, tiempo });
  } catch (err) {
    console.error("ERROR EN POST FEED:", err);
    res.status(500).json({ msg: 'Error al crear publicación.' });
  }
};
