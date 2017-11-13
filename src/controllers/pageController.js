const kue = require('kue');

const pageService = require('../services/pageService');
const projectService = require('../services/projectService');
const userService = require('../services/userService');
const navigationService = require('../services/navigationService');

const { getUserOrCreate } = require('../helpers/user');
const navigationWorkerService = require('../services/workers/navigationWorkerService');


const queue = kue.createQueue();

module.exports = {
    /**
     * Get all pages visited
     *
     * @param {any} req
     * @param {any} res
    */
    getAll: async (req, res) => {
        const pages = await pageService.getAll();

        res.json({ pages });
    },

    /**
    * When user visit a page we register all data about, user, metrics, etc..
    * into a page a navigation page models.
    *
    */
    trackPage: async (req, res) => {
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

            navigationWorkerService.accumulateMetricsPageVisit(user._id, data);
        } else {
            console.log(`Project: ${project} (${data.project})`);
            console.log(`Data: ${data}`);
        }
    },

    /**
     * To register a new user action
     *
     */
    saveAction: async (req, res) => {
        const data = JSON.parse(req.body);

        const actions = data.data.actions || [];
        const scrollActions = data.data.scrollActions || [];

        const page = await pageService.getByToken(data.data.pageToken);
        if (page) {
            for (let i = 0; i < actions.length; i += 1) {
                page.actions.push(actions[i]);
            }

            for (let i = 0; i < scrollActions.length; i += 1) {
                page.scrollActions.push(scrollActions[i]);
            }

            page.save();
        }


        res.json({ success: true });
    }
}
