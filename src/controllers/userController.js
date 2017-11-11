const userService = require('../services/userService');


module.exports = {
    /**
     * Get all users
     *
     * @param {any} req
     * @param {any} res
    */
    getAll: async (req, res) => {
        const users = await userService.getAll();

        res.json({ users });
    },

    /**
     * Get all users created in a datetime range
     *
     * @param {any} req
     * @param {any} res
    */
    getAllByCreationDate: async (req, res) => {
        const dateFrom = new Date(req.params.dateFrom);
        const dateTo = new Date(req.params.dateTo);

        const users = await userService.getAllByCreationDate(dateFrom, dateTo);

        res.json({ users });
    }
}
