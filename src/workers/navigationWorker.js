const navigationWorkerService = require('../services/workers/navigationWorkerService');
const { getTypeSeccionPage } = require('../helpers/page');
const { getUrlFromPageData } = require('../helpers/pageData');
const workerActionHelper = require('../helpers/workers/actions');
const timeHelper = require('../helpers/time');


const {
    updateMetricPageContent,
    generateNewPageVisit
 } = require('../helpers/workers/page');

const workerActionUpdater = {
    'change currency': workerActionHelper.saveChangeCurrencyAction,
    'add room': workerActionHelper.saveAddRoomAction
};

module.exports = {
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions,
    accumulateMetricsBookings
};

/**
 * When a user visit a page, we need to accumulate all data about
 * page, user, metaData, etc...
 * @param {object} pageData
 * @param {callback} done
 */
async function accumulateMetricsPageVisit(pageData, done) {
    const url = getUrlFromPageData(pageData);
    const project = pageData.project;
    const currentMonth = timeHelper.getCurrentMonth();
    const currentYear = timeHelper.getCurrentYear();

    // Get page type (content, availability, no-availability...)
    const pageType = getTypeSeccionPage(url);
    const metricQuery = {
        month: currentMonth,
        year: currentYear,
        type: pageType,
        project,
    };

    const metric = await navigationWorkerService.findMetricRowByQuery(metricQuery);

    if (!metric) {
        const metricPage = generateNewPageVisit(pageData);
        const pageVisitModel = await navigationWorkerService.createPageVisit(metricPage);

        const metricObj = {
            project,
            type: pageType,
            pages: [pageVisitModel],
            month: currentMonth,
            year: currentYear
        };

        navigationWorkerService.create(metricObj);
    } else {
        const indexPage = metric.pages.findIndex(each => each.url === url);

        if (indexPage !== -1) {
            // Update
            const currentPage = metric.pages[indexPage];
            const pageVisitUpdated = updateMetricPageContent(currentPage, pageData);
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
    const page = await navigationWorkerService.findPageVisitByURL(url);
    const today = timeHelper.getTodayHumanDate();

    if (page) {
        if (!page.actions[today]) {
            page.actions[today] = {};
        }

        for (let i = 0; i < actions.length; i += 1) {
            const action = actions[i];
            const actionName = action.key;
            const actionValue = JSON.parse(action.value);
            const updater = workerActionUpdater[actionName];


            page.actions[today][actionName] = updater(page.actions[today][actionName], actionValue);
        }

        await navigationWorkerService.updatePage(url, page);

    }

    done();
}




async function accumulateMetricsBookings(navigationData, done) {
    // console.log("Acumulando bookings...")
    // console.log(navigationData);
    done();
}