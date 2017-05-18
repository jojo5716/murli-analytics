const userService = require('../services/userService');


function userController() {

    this.getAll = (req, res) => {
        userService.getAll((err, users) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.json({ users });
            }
        });
    };

    this.getAllByCreationDate = (req, res) => {
        const dateFrom = new Date(req.params.dateFrom);
        const dateTo = new Date(req.params.dateTo);

        userService.getAllByCreationDate(dateFrom, dateTo, (err, users) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.json({ users });
            }
        });
    };

    return this;
}

module.exports = new userController();
