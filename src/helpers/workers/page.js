const pageDataHelper = require('../../helpers/pageData');
const timeHelper = require('../../helpers/time');
const workerUpdater = require('../../helpers/workers/updaters');



module.exports = {
    generateNewPageVisit,
    updateMetricPageContent,
    initializerMetricDateTime
};

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
        actions: {},
        availabilities: {}
    }
}

function initializerMetricDateTime(today, metricObject, timeValue) {
    if (!metricObject[today.stringDate]) {
        metricObject[today.stringDate] = 0;
    }

    if (!metricObject[today.stringDate][today.currentTime]) {
        metricObject[today.stringDate][today.currentTime] = timeValue;
    }

    return metricObject;

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
    const today = {
        stringDate: timeHelper.getTodayHumanDate(),
        currentTime:timeHelper.getCurrentTime()
    };

    metricPage.visits = workerUpdater.updateTotalVisits(today, metricPage.visits);
    metricPage.atHours = workerUpdater.updateHoursVisits(today, metricPage.atHours);
    metricPage.previousUrl = workerUpdater.updatePreviousURLVisits(today, metricPage.previousUrl, pageData);

    metricPage.users = workerUpdater.updateUserVisit(today, metricPage.users, pageData.userID);
    metricPage.devices = workerUpdater.updateDeviceVisit(today,metricPage.devices, pageData);
    metricPage.countries = workerUpdater.updateCountriesVisit(today, metricPage.countries, pageData);
    metricPage.metaData = workerUpdater.updateMetaDatasAttr(today, metricPage.metaData, pageData);
    metricPage.availabilityInfo = workerUpdater.updateAvailabilityInfo(today, metricPage.availabilities, pageData);
    metricPage.actions = {};

    // TODO: reservas.
    return metricPage;
}
