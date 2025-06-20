const express = require("express");
const router = express.Router();
const actividadController = require("../controllers/actividadController");
router.get("/", actividadController.getActividades);
module.exports = router;
