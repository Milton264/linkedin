const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('avatar'), authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.profile);

module.exports = router;
