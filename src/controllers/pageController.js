const Promise = require('promise');

const pageService = require('../services/pageService');
const { getProject } = require('../helpers/project');
const { getUserOrCreate } = require('../helpers/user');
const { getNavigation, createNavigation, updatePage } = require('../helpers/page');

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
                const navigationPromise = new Promise(getNavigation.bind(this, data)).then(navigation => {
                    if (!navigation) {
                        createNavigation(data, user);
                    } else {
                        // If we can a page we update with the new info.
                        updatePage(navigation, data);
                    }
                    return res.send({ success: true });
                }).catch(err => {
                    console.log(`NAVIGATION PROMISE ERROR: ${err}`);
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
        const dateFrom = new Date(req.params.dateFrom);
        const dateTo = new Date(req.params.dateTo);

        pageService.getByCreate(dateFrom, dateTo, (err, users) => {
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

module.exports = new pageController();
