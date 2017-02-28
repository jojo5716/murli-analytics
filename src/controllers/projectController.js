function projectController() {
    const projectSchema = require('../models/projectSchema');
    const projectServices = require('../services/projectService');

    this.createProject = (req, res) => {
        let name = req.body.name;

        projectSchema.create({ name }, (err, result) => {
            if (err) {
                console.log(err);
                return res.send({ error: err });
            } else {
                return res.send({ result, success: true });
            }
        });
    };


    this.getProjects = (req, res) => {
        projectServices.getAll((err, projects) => {
            if (err) {
                console.log(err);
                return res.send({ error: err });
            } else {
                return res.json({ projects });
            }
        });
    };

    return this;
}

module.exports = new projectController();
