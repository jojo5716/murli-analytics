const navigationService = require('../services/navigationService');
const pageService = require('../services/pageService');


function getNavigation(sessionTemp, resolve, reject) {
    navigationService.getBySession(sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function getNavigationByProject(project, resolve, reject) {

    navigationService.getByProject(project, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function createNavigation(data, user, project) {
    const pageData = mergePageInfo(data);

    new Promise(createPage.bind(this, pageData)).then((page) => {
        navigationService.create({
            sessionTemp: data.data.sessionTemp,
            pages: page,
            project: project._id,
            user
        }, (err, navigation) => {});
    });
}

function createPage(data, resolve, reject) {
    pageService.create(data, (err, page) => {
        if (err) {
            reject(err);
        } else {
            resolve(page);
        }
    });
}

function mergePageInfo(data) {
    const pageInfo = data.data.page[0];
    const metaDatas = data.data.metaData;
    const actions = data.data.actions;
    const pageInfoCloned = Object.assign({}, pageInfo);

    pageInfoCloned.loadedOn = new Date().getTime();
    pageInfoCloned.pageToken = data.data.pageToken;

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


function updatePage(navigation, data) {
    const pageData = mergePageInfo(data);

    new Promise(createPage.bind(this, pageData)).then((newPage) => {
        navigation.pages.push(newPage);
        navigation.save(() => {});
    });
}

module.exports = {
    getNavigation,
    createNavigation,
    createPage,
    updatePage,
    getNavigationByProject
};
