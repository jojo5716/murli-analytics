const pageDataHelper = require('../../helpers/pageData');
const timeHelper = require('../../helpers/time');
const workerUpdater = require('../../helpers/workers/updaters');



module.exports = {
    generateBasicMetricPageSchema,
    generateNewPageVisit,
    updateMetricPageContent
}

/**
 * Generate a new page visit model
 *
 * @param {object} pageData
 * @returns {object} Page visit
 */
function generateNewPageVisit(pageData) {
    const url = pageDataHelper.getUrlFromPageData(pageData);
    const metricPage = generateBasicMetricPageSchema(url);

    return updateMetricPageContent(metricPage, pageData);
}

/**
 * Generate a basic schema of metric page
 *
 * @param {string} url
 * @returns {object} Empty schema of Metric page
 */
function generateBasicMetricPageSchema(url) {
    return {
        url,
        visits: {},
        users: {},
        atHours: {},
        previousUrl: {},
        devices: {},
        countries: {},
        metaData: {},
        actions: {}
    }
}


/**
 * Update a page visit metric
 *
 * @param {object} metricPage
 * @param {object} pageData
 * @returns {object} Metric page updated
 */
function updateMetricPageContent(metricPage, pageData) {
    // Today human date format
    const today = timeHelper.getTodayHumanDate();

    metricPage.visits = workerUpdater.updateTotalVisits(today, metricPage.visits);
    metricPage.atHours = workerUpdater.updateHoursVisits(today, metricPage.atHours, pageData);
    metricPage.previousUrl = workerUpdater.updatePreviousURLVisits(today, metricPage.previousUrl, pageData);

    metricPage.users = workerUpdater.updateUserVisit(today, metricPage.users, pageData.userID);
    metricPage.devices = workerUpdater.updateDeviceVisit(today,metricPage.devices, pageData);
    metricPage.countries = workerUpdater.updateCountriesVisit(today, metricPage.countries, pageData);
    metricPage.metaData = workerUpdater.updateMetaDatasAttr(today, metricPage.metaData, pageData);
    metricPage.availabilityInfo = workerUpdater.updateAvailabilityInfo(metricPage.availability, pageData);
    metricPage.actions = {};

    // TODO: reservas.
    return metricPage;
}
