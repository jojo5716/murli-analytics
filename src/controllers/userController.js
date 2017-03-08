const Promise = require('promise');

const { getProject } = require('../helpers/project');
const { getUserOrCreate } = require('../helpers/user');
const { getNavigation, createNavigation, updatePage } = require('../helpers/page');

const userService = require('../services/userService');


function userController() {

    this.createUser = (req, res) => {
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
    return this;
}

module.exports = new userController();
