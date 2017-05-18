const Promise = require('promise');

const navigationService = require('../services/navigationService');
const { getProject } = require('../helpers/project');
const { getUserOrCreate } = require('../helpers/user');

/**
 * Navigation Controller
 */
module.exports = {

    /**
     * Get all navigations created between
     * two dates
     */
    getAllByCreationDate: (req, res) => {
        const project = req.params.project;
        const page = req.params.page;
        let dateFrom = req.params.dateFrom;
        let dateTo = req.params.dateTo;

        dateFrom = new Date(`${dateFrom}T00:00:00.000Z`);
        dateTo = new Date(`${dateTo}T23:59:59.599Z`);

        navigationService.getAllByCreationDate(dateFrom, dateTo, project, page, (err, navigationPages) => {
            if (err) {
                res.send({ error: err });
            } else {
                res.json({ navigationPages });
            }
        });
    }

}
