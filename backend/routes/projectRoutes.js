// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
router.get("/", projectController.getProjects); // así sí existe
module.exports = router;
