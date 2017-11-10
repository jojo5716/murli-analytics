const pageService = require('../services/pageService');
const projectService = require('../services/projectService');
const userService = require('../services/userService');
const navigationService = require('../services/navigationService');

const { getUserOrCreate } = require('../helpers/user');



function pageController() {
    /**
     * Get all pages visited
     *
     * @param {any} req
     * @param {any} res
     */
    this.getAll = async (req, res) => {
        const pages = await pageService.getAll();

        res.json({ pages });
    };

    /**
    * When user visit a page we register all data about, user, metrics, etc..
    * into a page a navigation page models.
    *
    */
    this.trackPage = async (req, res) => {
        const data = JSON.parse(req.body || null);
        const project = await projectService.getById(data.project);

        if (project && data) {
            const sessionTemp = data.data.sessionTemp;
            const user = await userService.getUserOrCreate(data);
            const navigation = await navigationService.getByProject(project._id, sessionTemp);

            if (navigation) {
                // Then is not the first time thant user visit a page
                // and we need to update the pages model.
                pageService.updatePage(navigation, data);
            } else {
                navigationService.createNavigation(data, user, project._id);
            }
        }
    };

    /**
     * To register a new user action
     *
     */
    this.saveAction = async (req, res) => {
        const data = JSON.parse(req.body);

        const page = await pageService.getByToken(data.data.pageToken);

        for (let i = 0; i < data.data.actions.length; i += 1) {
            page.actions.push(data.data.actions[i]);
        }

        page.save();

        res.json({ success: true });
    };

    /**
     * Get navigation and pages by a date
     *
     */
    this.getAllByCreationDate = async (req, res) => {
        let dateFrom = req.params.dateFrom;
        let dateTo = req.params.dateTo;

        dateFrom = new Date(`${dateFrom}T00:00:00.000Z`);
        dateTo = new Date(`${dateTo}T23:59:59.599Z`);

        const navigationPages = await navigationService.getAllByCreationDate(dateFrom, dateTo, project);

        res.json({ navigationPages });
    };

    /**
     * Get all navigation pages
     *
     * @returns {array} Navigation pages
     */
    this.getAllNavigations = async (req, res) => {
        const navigations = await navigationService.getAll();

        res.json({ navigations });
    };

    return this;
}

module.exports = new pageController();
