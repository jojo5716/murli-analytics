const projectSchema = require('../models/projectSchema');
const projectServices = require('../services/projectService');


module.exports = {
    /**
     * Create new project
     *
     * @param {any} req
     * @param {any} res
    */
    createProject: async(req, res) => {
        console.log(req.body)
        let name = req.body.name;

        const project = await projectSchema.create({ name });

        return res.send({ project, success: true });
    },

    /**
     * Get all projects
     *
     * @param {any} req
     * @param {any} res
    */
    getProjects: async(req, res) => {
        const projects = await projectServices.getAll();

        return res.json({ projects });
    }
}
