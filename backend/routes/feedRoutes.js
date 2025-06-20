const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

router.get('/', feedController.getFeed);
router.post('/', feedController.createFeed);
router.post('/:id/like', feedController.likePost);
router.get('/:id/likes', feedController.getLikes);
router.post('/:id/fav', feedController.favPost);
router.get('/:id/favs', feedController.getFavs);
router.post('/:id/edit', feedController.editPost);
router.delete('/:id', feedController.deletePost);

module.exports = router;
