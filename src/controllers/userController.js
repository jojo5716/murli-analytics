const Promise = require('promise');

const userSchema = require('../models/userSchema');
const pageService = require('../services/pageService');
const userService = require('../services/userService');
const projectService = require('../services/projectService');

function getUserOrCreate(data, resolve, reject) {
    userService.getBySession(data.data.session, (err, user) => {
        if (err) reject(err);

        if (user) {
            resolve(user);
        } else {
            const userInfo = {
                dataUser: data.data.enviroment[0],
                session: data.data.session
            };
            const extraData = mergeUserInfo(data.data.userInfo);
            const mergedInfo = Object.assign(userInfo, extraData);

            userService.create(mergedInfo, (error, user) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        }
    });
}

function getProject(projectID, resolve, reject) {
    projectService.getById(projectID, (err, project) => {
        if (err || !project) {
            reject(err);
        }
        resolve(project);
    });
}

function getPage(data, resolve, reject) {
    pageService.getBySession(data.data.sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function createPage(data, user) {
    pageService.create({
        sessionTemp: data.data.sessionTemp,
        pages: mergePageInfo(data),
        user
    }, () => {});
}

function mergeUserInfo(userInfo) {
    const info = {};
    for (const key in userInfo) {
        const userData = userInfo[key];
        info[userData.key] = userData.value;
    }
    return info;
}
function mergePageInfo(data) {
    const pageInfo = data.data.page[0];
    const leavesAt = data.data.leaveAt;
    const metaDatas = data.data.metaData;
    const actions = data.data.actions;
    const pageInfoCloned = Object.assign({}, pageInfo);

    pageInfoCloned.leavesAt = leavesAt;

    if (!pageInfoCloned.metaData) {
        pageInfoCloned.metaData = [];
    }

    if (!pageInfoCloned.actions) {
        pageInfoCloned.actions = [];
    }

    for (const metadata in metaDatas) {
        pageInfoCloned.metaData.push(metaDatas[metadata]);
    }

    for (const action in actions) {
        pageInfoCloned.actions.push(actions[action]);
    }

    return pageInfoCloned;
}
function updatePage(page, data) {
    page.pages.push(mergePageInfo(data));
    page.save(() => {});
}

function userController() {

    this.createUser = (req, res) => {
        const data = JSON.parse(req.body || null);
        // Getting project
        const projectPromise = new Promise(getProject.bind(this, data.project)).then(project => {
            // Getting or create user
            const userPromise = new Promise(getUserOrCreate.bind(this, data)).then(user => {
                // Getting page
                const pagePromise = new Promise(getPage.bind(this, data)).then(page => {
                    if (!page) {
                        createPage(data, user);
                    } else {
                        // If we can a page we update with the new info.
                        updatePage(page, data);
                    }
                    return res.send({ success: true });
                }).catch(err => {
                    console.log(`PAGE PROMISE ERROR: ${err}`);
                });
            }).catch(err => {
                console.log(`USER PROMISE ERROR: ${err}`);
            });
        }).catch(err => {
            console.log(`PROJECT PROMISE ERROR: ${err}`);
        });
    };

    this.getAllData = (req, res) => {
        userService.getAll((err, users) => {
            if (err) {
                console.log(err);
                res.send({ error: err });
            } else {
                res.send({ users });
            }
        });
    };
    return this;
}

module.exports = new userController();
