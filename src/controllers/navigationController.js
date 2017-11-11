const Promise = require('promise');

const navigationService = require('../services/navigationService');
const { getProject } = require('../helpers/project');
const { getUserOrCreate } = require('../helpers/user');

/**
 * Navigation Controller
 */
module.exports = {

    /**
     * Gets all navigations (paginated)
     */
    getAll: async (req, res) => {
        const page = req.params.page || 1;
        const navigationPages = await navigationService.getAll(page);

        res.json({ navigationPages });
    },

    /**
     * Get all navigations created between
     * two dates
     */
    getAllByCreationDate: async (req, res) => {
        const project = req.params.project;
        const page = req.params.page || 1;
        let dateFrom = req.params.dateFrom;
        let dateTo = req.params.dateTo;

        dateFrom = new Date(`${dateFrom}T00:00:00.000Z`);
        dateTo = new Date(`${dateTo}T23:59:59.599Z`);

        const navigationPages = await navigationService.getAllByCreationDate(dateFrom, dateTo, project, page);

        res.json({ navigationPages });
    }

}
