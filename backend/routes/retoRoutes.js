const express = require("express");
const router = express.Router();
const retoController = require("../controllers/retoController");
router.get("/", retoController.getRetos);
module.exports = router;
