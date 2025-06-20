const express = require("express");
const router = express.Router();
const mensajeController = require("../controllers/mensajeController");
router.get("/", mensajeController.getMensajes);
module.exports = router;
