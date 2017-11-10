function projectController() {
    const projectSchema = require('../models/projectSchema');
    const projectServices = require('../services/projectService');

    this.createProject = async(req, res) => {
        let name = req.body.name;

        const project = await projectSchema.create({ name });

        return res.send({ project, success: true });
    };


    this.getProjects = async(req, res) => {
        const projects = await projectServices.getAll();

        return res.json({ projects });
    };

    return this;
}

module.exports = new projectController();
