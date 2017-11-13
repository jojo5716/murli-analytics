const pageMetricSchema = require('../models/metrics/pageMetricSchema');
const pageVisitSchema = require('../models/metrics/pageVisitSchema');
const navigationWorkerService = require('../services/workers/navigationWorkerService');
const projectService = require('../services/projectService');
const { getTypeSeccionPage } = require('../helpers/page');
const { getUrlFromPageData } = require('../helpers/pageData');

const {
    getAtHourVisit,
    generateBasicMetricPageSchema,
    updateMetricPageContent,
    updateDeviceVisit,
    generateNewPageVisit
 } = require('../helpers/workers/page');

module.exports = {
    accumulateMetricsPageVisit
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
            const pageVisit = await navigationWorkerService.findPageVisitByID(currentPage._id);
            const pageVisitUpdated = updateMetricPageContent(pageVisit, pageData);

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