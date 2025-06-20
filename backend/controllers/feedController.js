const Feed = require('../models/Feed');
const FeedLike = require('../models/FeedLike');
const FeedFav = require('../models/FeedFav');

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

// POST /api/feed/:id/like
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) return res.status(400).json({ msg: 'Falta username.' });
    await FeedLike.addLike({ feed_id: id, username });
    res.json({ msg: 'Like registrado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al registrar like.' });
  }
};

// GET /api/feed/:id/likes
exports.getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await FeedLike.getLikesByFeed(id);
    res.json(likes);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener likes.' });
  }
};

// POST /api/feed/:id/fav
exports.favPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) return res.status(400).json({ msg: 'Falta username.' });
    await FeedFav.addFav({ feed_id: id, username });
    res.json({ msg: 'Favorito agregado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar favorito.' });
  }
};

// GET /api/feed/:id/favs
exports.getFavs = async (req, res) => {
  try {
    const { id } = req.params;
    const favs = await FeedFav.getFavsByFeed(id);
    res.json(favs);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener favoritos.' });
  }
};

// POST /api/feed/:id/edit
exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ msg: 'Mensaje vacío.' });
    await Feed.updateFeed(id, mensaje);
    res.json({ msg: 'Post actualizado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar publicación.' });
  }
};

// DELETE /api/feed/:id
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Feed.deleteFeed(id);
    res.json({ msg: 'Post eliminado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar publicación.' });
  }
};
