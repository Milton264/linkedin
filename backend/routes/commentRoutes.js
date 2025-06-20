const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET /api/feed/:id/comments
router.get('/:id/comments', commentController.getComments);
// POST /api/feed/:id/comment
router.post('/:id/comment', commentController.addComment);

module.exports = router;
