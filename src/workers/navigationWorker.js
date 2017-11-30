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

    // Query to find metric object
    const metricQuery = {
        month: currentMonth,
        year: currentYear,
        type: pageType,
        project,
    };

    const pathKeys = [
        timeHelper.getTodayHumanDate(),
    ];

    const pathDetailKeys = [
        timeHelper.getTodayHumanDate(),
        timeHelper.getCurrentTime()
    ];

    const metric = await navigationWorkerService.findMetricRowByQuery(metricQuery);

    if (!metric) {
        const metricDetailPage = generateNewPageVisit(pageData, pathDetailKeys);

        const metricPage = generateNewPageVisit(pageData, pathKeys);

        // Adding new page visit to the query object
        metricQuery.pages = await navigationWorkerService.createPageVisit(metricPage);
        metricQuery.detailPages = await navigationWorkerService.createDetailPageVisit(metricDetailPage);

        navigationWorkerService.createPageMetric(metricQuery);
    } else {
        const indexPage = metric.pages.findIndex(each => each.url === url);
        const indexDetailPage = metric.detailPages.findIndex(each => each.url === url);

        if (indexPage !== -1) {
            // Update
            console.log("-------------START Update page visit ----------");

            const currentPage = metric.pages[indexPage];
            console.log("METRIC");
            console.log(metric);
            console.log(`indexPage: ${indexPage}`);
            const pageVisitUpdated = await updateMetricPageContent(currentPage, pageData, pathKeys);
            console.log("-------------END Update page visit ----------");

            await navigationWorkerService.updatePage(url, pageVisitUpdated);
        } else {
            // New page visit
            const metricPage = generateNewPageVisit(pageData, pathKeys);
            const pageVisitModel = await navigationWorkerService.createPageVisit(metricPage);

            metric.pages.push(pageVisitModel);
            metric.save();
        }

        // Detail pages...
        if (indexDetailPage !== -1) {
            console.log("-------------START Update detail page visit ----------");

            const currentPage = metric.detailPages[indexPage];
            console.log("METRIC");
            console.log(metric);
            console.log(`indexPage: ${indexPage}`);
            const pageDetailVisitUpdated = updateMetricPageContent(currentPage, pageData, pathDetailKeys);
            await navigationWorkerService.updateDetailPage(url, pageDetailVisitUpdated);
            console.log("-------------END Update detail page visit ----------");

        } else {
            const metricDetailPage = generateNewPageVisit(pageData, pathDetailKeys);
            const pageDetailVisitModel = await navigationWorkerService.createDetailPageVisit(metricDetailPage);
            metric.detailPages.push(pageDetailVisitModel);
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