const pageMetricSchema = require('../models/metrics/pageMetricSchema');
const pageVisitSchema = require('../models/metrics/pageVisitSchema');
const navigationWorkerService = require('../services/workers/navigationWorkerService');
const projectService = require('../services/projectService');
const { getTypeSeccionPage } = require('../helpers/page');
const { getUrlFromPageData } = require('../helpers/pageData');
const workerActionHelper = require('../helpers/workers/actions');


const {
    getAtHourVisit,
    generateBasicMetricPageSchema,
    updateMetricPageContent,
    updateDeviceVisit,
    generateNewPageVisit
 } = require('../helpers/workers/page');

const workerActionUpdater = {
    'change currency': workerActionHelper.saveChangeCurrencyAction,
    'add room': workerActionHelper.saveAddRoomAction
};

module.exports = {
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions
}

/**
 * When a user visit a page, we need to accumulate all data about
 * page, user, metaData, etc...
 * @param {object} pageData
 * @param {callback} done
 */
async function accumulateMetricsPageVisit(pageData, done) {
    const url = getUrlFromPageData(pageData);
    const project = pageData.project;
    // Get page type (content, availability, no-availability...)
    const pageType = getTypeSeccionPage(url);
    const metric = await navigationWorkerService.findMetricRowByType(project, pageType);

    if (!metric) {
        const metricPage = generateNewPageVisit(pageData);
        const pageVisitModel = await navigationWorkerService.createPageVisit(metricPage);

        const metricObj = {
            project,
            type: pageType,
            pages: [pageVisitModel]
        };

        navigationWorkerService.create(metricObj);
    } else {
        const indexPage = metric.pages.findIndex(each => each.url === url);

        if (indexPage !== -1) {
            // Update
            const currentPage = metric.pages[indexPage];
            const pageVisitUpdated = updateMetricPageContent(currentPage, pageData);
            console.log(pageVisitUpdated)
            await navigationWorkerService.updatePage(url, pageVisitUpdated);
        } else {
            // New page visit
            const metricPage = generateNewPageVisit(pageData);
            const pageVisitModel = await navigationWorkerService.createPageVisit(metricPage);

            metric.pages.push(pageVisitModel);
            metric.save();
        }
    }

    done();
}



async function accumulateMetricsPageActions(pageData, done) {
    const actions = pageData.data.actions || [];
    const url = getUrlFromPageData(pageData);
    const page = await navigationWorkerService.findPageVisitByID(url);
    console.log(".....")
    const x = {};
    x['2.2'] =3;

    if (page) {
        for (let i = 0; i < actions.length; i += 1) {
            const action = actions[i];
            const actionName = action.key;
            const actionValue = JSON.parse(action.value);
            const updater = workerActionUpdater[actionName];

            page.actions[actionName] = updater(page.actions[actionName], actionValue);
        }

        await navigationWorkerService.updatePage(url, page);

    }

    done();
}


