const userService = require('../services/userService');


function userController() {

    this.getAll = async(req, res) => {
        const users = await userService.getAll();

        res.json({ users });
    };


    this.getAllByCreationDate = async(req, res) => {
        const dateFrom = new Date(req.params.dateFrom);
        const dateTo = new Date(req.params.dateTo);

        const users = await userService.getAllByCreationDate(dateFrom, dateTo);

        res.json({ users });
    };

    return this;
}

module.exports = new userController();
