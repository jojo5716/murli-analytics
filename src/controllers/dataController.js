function dataController() {
    const dataSchema = require('../models/dataSchema');
    this.createData = (req, res) => {
        let data;
        try {
            data = JSON.parse(req.params.data);
        } catch(err) {
            data = null;
        }

        if (data) {
            dataSchema.create({ data }, (err, result) => {
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
}

module.exports = new dataController();
