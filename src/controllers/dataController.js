function dataController() {
    const dataSchema = require('../models/dataSchema');
    const dataService = require('../services/dataService');
    const projectService = require('../services/projectService');

    this.createData = (req, res) => {
        const projectID = req.body.project;
        const data = JSON.parse(req.body.data || null);

        projectService.getById(projectID, (projectErr, project) => {
            if (projectErr || !project) {
                console.log(projectErr);
                res.send({ error: projectErr });
            } else {
                dataSchema.create({ data, project }, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.send({ error: err });
                    } else {
                        return res.send({ result, success: true });
                    }
                });
            }
        });

    };

    this.getAllData = (req, res) => {
        dataService.getAll((err, data) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.send({ data });
            }
        });
    };
    return this;
}

module.exports = new dataController();
