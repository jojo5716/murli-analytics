const navigationService = require('../services/navigationService');
const pageService = require('../services/pageService');


function getNavigation(data, resolve, reject) {
    navigationService.getBySession(data.data.sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function createNavigation(data, user) {
    const pageData = mergePageInfo(data);

    new Promise(createPage.bind(this, pageData)).then((page) => {
        navigationService.create({
            sessionTemp: data.data.sessionTemp,
            pages: page,
            user
        }, (err, navigation) => {
            console.log(err);
            console.log(navigation);
        });
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


function updatePage(page, data) {
    const pageData = mergePageInfo(data);

    new Promise(createPage.bind(this, pageData)).then((newPage) => {
        page.pages.push(newPage);
        page.save(() => {});
    });


}
module.exports = {
    getNavigation,
    createNavigation,
    createPage,
    updatePage
};
