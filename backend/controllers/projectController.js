// controllers/projectController.js
const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.getAllProjects();
    res.json(projects);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener proyectos." });
  }
};

exports.createProject = async (req, res) => {
  try {
    const id = await Project.addProject(req.body);
    res.json({ msg: "Proyecto creado", id });
  } catch (e) {
    res.status(500).json({ msg: "Error al crear proyecto." });
  }
};
