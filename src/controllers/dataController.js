function dataController() {
    const dataSchema = require('../models/dataSchema');

    this.createData = (req, res) => {
        const project = req.body.project;
        const data = JSON.parse(req.body.data || null);

        if (data && project) {

            dataSchema.create({ data, project }, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({ error: err });
                } else {
                    return res.send({ result, success: true });
                }
            });
        } else {
            return res.send({ error: true });
        }
    };

    this.getAllData = (req, res) => {
        dataSchema.find({}, (err, data) => {
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
