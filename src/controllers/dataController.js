function dataController() {
    const dataSchema = require('../models/dataSchema');
    const dataService = require('../services/dataService');
    const projectService = require('../services/projectService');

    this.createData = (req, res) => {
        const data = JSON.parse(req.body || null);

        projectService.getById(data.project, (projectErr, project) => {
            if (projectErr || !project) {
                console.log(projectErr);
                res.send({ error: projectErr });
            } else {
                dataSchema.create({ data: data.data, project: project }, (err, result) => {
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
