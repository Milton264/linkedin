const express = require("express");
const router = express.Router();
const mentoriaController = require("../controllers/mentoriaController");
router.get("/", mentoriaController.getMentorias);
module.exports = router;
