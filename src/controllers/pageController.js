const kue = require('kue');

const pageService = require('../services/pageService');
const projectService = require('../services/projectService');
const userService = require('../services/userService');
const navigationService = require('../services/navigationService');

const { mergePageInfo } = require('../helpers/page');
const workerJobs = require('../jobs/index');


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
        const pageData = req.body;

        if (!pageData) return res.json({ success: false });

        const project = await projectService.getById(pageData.project);

        if (project) {
            const sessionTemp = pageData.data.sessionTemp;
            const user = await userService.getUserOrCreate(pageData);
            const navigation = await navigationService.getByProject(project._id, sessionTemp);
            let currentNavigation;

            if (navigation) {
                // Then is not the first time thant user visit a page
                // and we need to update the pages model.
                currentNavigation = await pageService.updatePage(navigation, pageData);
            } else {
                const page = await pageService.create(mergePageInfo(pageData));
                const navigationQuery = {
                    sessionTemp,
                    user,
                    page,
                    project: project._id
                };
                currentNavigation = await navigationService.createNavigation(navigationQuery);
            }

            workerJobs.accumulateMetricsPageVisit(user._id, pageData);
            workerJobs.accumulateMetricsBookings(currentNavigation, pageData);
        } else {
            console.log(`Project: ${project} (${pageData.project})`);
            console.log(`pageData: ${pageData}`);
        }

        res.json({ success: true });
    },

    /**
     * To register a new user action
     *
     */
    saveAction: async (req, res) => {
        const pageData = req.body;
        const actions = pageData.data.actions || [];
        const scrollActions = pageData.data.scrollActions || [];

        const page = await pageService.getByToken(pageData.data.pageToken);

        if (page) {
            for (let i = 0; i < actions.length; i += 1) {
                page.actions.push(actions[i]);
            }

            for (let i = 0; i < scrollActions.length; i += 1) {
                page.scrollActions.push(scrollActions[i]);
            }

            page.save();
        }

        workerJobs.accumulateMetricsPageActions(pageData);

        res.json({ success: true });
    },

    deleteAllJobs: (req, res) => {
        const jobName = req.query.jobName || 'active';

        kue.Job.rangeByState(jobName, 0, 2000, 'asc', function (err, jobs) {
            jobs.forEach(function (job) {
                job.remove(function () {
                    console.log('removed ', job.id);
                });
            });
        });

        res.json({ success: true });
    }
};
