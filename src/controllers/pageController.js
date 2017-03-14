const Promise = require('promise');

const pageService = require('../services/pageService');
const { getProject } = require('../helpers/project');
const { getUserOrCreate } = require('../helpers/user');
const { getNavigationByProject, createNavigation, updatePage } = require('../helpers/page');

function pageController() {

    this.getAll = (req, res) => {
        pageService.getAll((err, pages) => {
            if (err) {
                console.log(err);
                res.json({ error: err });
            } else {
                res.json({ pages });
            }
        });
    };

    this.trackPage = (req, res) => {
        const data = JSON.parse(req.body || null);
        // Getting project
        const projectPromise = new Promise(getProject.bind(this, data.project)).then(project => {
            // Getting or create user
            const userPromise = new Promise(getUserOrCreate.bind(this, data)).then(user => {
                // Getting page
                const navigationPromise = new Promise(getNavigationByProject.bind(this, project)).then(navigation => {
                    if (!navigation) {
                        createNavigation(data, user, project);
                    } else {
                        // If we can a page we update with the new page info.
                        updatePage(navigation, data);
                    }
                    return res.send({ success: true });
                }).catch(err => {
                    console.log(`NAVIGATION PROMISE ERROR`);
                    console.log(err);
                });
            }).catch(err => {
                console.log(`USER PROMISE ERROR: ${err}`);
            });
        }).catch(err => {
            console.log(`PROJECT PROMISE ERROR: ${err}`);
        });
    };

    this.saveAction = (req, res) => {
        const data = JSON.parse(req.body);

        pageService.getByToken(data.data.pageToken, (error, page) => {
            if (error || !page) {
                res.json({ error });
            } else {
                for (let i = 0; i < data.data.actions.length; i += 1) {
                    page.actions.push(data.data.actions[i]);
                }
                page.save(() => {});
                res.json({ success: true });
            }
        });
    };

    this.getByCreate = (req, res) => {
        let dateFrom = req.params.dateFrom;
        let dateTo = req.params.dateTo;
        let project = req.params.project;

        dateFrom = new Date(`${dateFrom}T00:00:00.000Z`);
        dateTo = new Date(`${dateTo}T23:59:59.599Z`);

        pageService.getByCreate(dateFrom, dateTo, project, (err, navigationPages) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.json({ navigationPages });
            }
        });
    };

    return this;
}

module.exports = new pageController();
