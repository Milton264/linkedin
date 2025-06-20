// controllers/commentController.js
const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params; // id del feed/post
    const comments = await Comment.getCommentsByFeed(id);
    res.json(comments);
  } catch (e) {
    res.status(500).json({ msg: 'Error al obtener comentarios.' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // id del feed/post
    const { username, avatar, comment, tiempo } = req.body;
    if (!comment || !username) return res.status(400).json({ msg: 'Comentario o usuario vacío.' });
    await Comment.addComment({ feed_id: id, username, avatar, comment, tiempo });
    res.json({ msg: "Comentario agregado" });
  } catch (e) {
    res.status(500).json({ msg: 'Error al agregar comentario.' });
  }
};
