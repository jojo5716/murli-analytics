const pageDataHelper = require('../../helpers/pageData');
const timeHelper = require('../../helpers/time');
const workerUpdater = require('../../helpers/workers/updaters');


module.exports = {
    generateNewPageVisit,
    updateMetricPageContent
};

/**
 * Generate a new page visit model
 *
 * @param {object} pageData
 * @param {array} pathKeys
 * @returns {object} Page visit
 */
function generateNewPageVisit(pageData, pathKeys) {
    const url = pageDataHelper.getUrlFromPageData(pageData);
    const metricPage = generateBasicMetricPageSchema(url);

    return updateMetricPageContent(metricPage, pageData, pathKeys);
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
        previousUrl: {},
        devices: {},
        countries: {},
        metaData: {},
        actions: {},
        availabilities: {}
    }
}


/**
 * Update a page visit metric
 *
 * @param {object} metricPage
 * @param {object} pageData
 * @param {array} keysPath
 * @returns {object} Metric page updated
 */
function updateMetricPageContent(metricPage, pageData, keysPath) {
    metricPage.visits = workerUpdater.updateTotalVisits(keysPath, metricPage.visits);
    metricPage.previousUrl = workerUpdater.updatePreviousURLVisits(keysPath, metricPage.previousUrl, pageData);

    metricPage.users = workerUpdater.updateUserVisit(keysPath, metricPage.users, pageData.userID);
    metricPage.devices = workerUpdater.updateDeviceVisit(keysPath,metricPage.devices, pageData);
    metricPage.countries = workerUpdater.updateCountriesVisit(keysPath, metricPage.countries, pageData);
    metricPage.metaData = workerUpdater.updateMetaDatasAttr(keysPath, metricPage.metaData, pageData);
    metricPage.availabilityInfo = workerUpdater.updateAvailabilityInfo(keysPath, metricPage.availabilities, pageData);
    metricPage.actions = {};

    // TODO: reservas.
    return metricPage;
}


