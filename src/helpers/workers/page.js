const UAParser = require('ua-parser-js');
const pageDataHelper = require('../../helpers/pageData');

const parser = new UAParser();


module.exports = {
    generateBasicMetricPageSchema,
    updateMetricPageContent,
    updateDeviceVisit,
    generateNewPageVisit
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
        visits: 0,
        users: {},
        atHours: [],
        previousUrl: [],
        devices: {},
        countries: {},
        metaData: {},
        actions: {}
    }
}

/**
 * Get information about user agent
 * Return an object with os name, version, browser info, etc..
 * @param {string} userAgent
 * @returns {object} User name data
 */
function getUserAgentInfo(userAgent) {
    return parser.setUA(userAgent).getResult()
}

/**
 * Return an object with a basic user agent data
 *
 * @param {object} userAgentInfo
 * @returns {object} User agent basic data
 */
function userAgentDeviceInfo(userAgentInfo) {
    return {
        deviceModel: userAgentInfo.device.model,
        deviceName: userAgentInfo.device.vendor,

        browserName: userAgentInfo.browser.name,
        browserVersion: userAgentInfo.browser.version.replaceAll('.', '#'),

        osName: userAgentInfo.os.name,
        osVersion: userAgentInfo.os.version.replace('.', '#')
    };
}

/**
 * Update an object of devices visits
 *
 * @param {object} devicesPage
 * @param {object} pageData
 * @returns {object} Devices visits
 */
function updateDeviceVisit(devicesPage, pageData) {
    const deviceListClone = Object.assign({}, devicesPage);
    const userAgent = pageDataHelper.getUserAgent(pageData);
    const userAgentInfo = getUserAgentInfo(userAgent);

    // Getting all browser and os info

    const {
        deviceModel,
        deviceName,
        browserName,
        browserVersion,
        osName,
        osVersion
    } = userAgentDeviceInfo(userAgentInfo);

    if (!deviceListClone[deviceName]) {
        deviceListClone[deviceName] = {};
    }

    if (!deviceListClone[deviceName][deviceModel]) {
        deviceListClone[deviceName][deviceModel] = {};
    }

    if (!deviceListClone[deviceName][deviceModel][osName]) {
        deviceListClone[deviceName][deviceModel][osName] = {};
    }

    if (!deviceListClone[deviceName][deviceModel][osName][osVersion]) {
        deviceListClone[deviceName][deviceModel][osName][osVersion] = {};
    }

    if (!deviceListClone[deviceName][deviceModel][osName][osVersion][browserName]) {
        deviceListClone[deviceName][deviceModel][osName][osVersion][browserName] = {};
    }

    if (!deviceListClone[deviceName][deviceModel][osName][osVersion][browserName][browserVersion]) {
        deviceListClone[deviceName][deviceModel][osName][osVersion][browserName][browserVersion] = 0;
    }

    // Increment a new visit for the device
    deviceListClone[deviceName][deviceModel][osName][osVersion][browserName][browserVersion] += 1;

    return deviceListClone;
}

function updateCountriesVisit(countries, countryVisit) {
    if (!countries[countryVisit]) {
        countries[countryVisit] = 0;
    }

    countries[countryVisit] += 1;

    return countries;
}

function updateUserVisit(userVisits, userID) {
    if (!userVisits[userID]) {
        userVisits[userID] = 0;
    }

    userVisits[userID] += 1;

    return userVisits;
}

/**
 * Update a page visit metric
 *
 * @param {object} metricPage
 * @param {object} pageData
 * @returns {object} Metric page updated
 */
function updateMetricPageContent(metricPage, pageData) {
    // Getting all data from pageData
    const loadedOn = pageDataHelper.getLoadedOn(pageData);
    const previousUrl = pageDataHelper.getPreviousUrl(pageData);
    const hourVisit = pageDataHelper.getAtHourVisit(loadedOn);
    const countryVisit = pageDataHelper.getCountry(pageData);

    metricPage.visits += 1;
    metricPage.atHours.push(hourVisit);
    metricPage.previousUrl.push(previousUrl);
    metricPage.users = updateUserVisit(metricPage.users, pageData.userID);
    metricPage.devices = updateDeviceVisit(metricPage.devices, pageData);
    metricPage.countries = updateCountriesVisit(metricPage.countries, countryVisit);
    metricPage.metaData = pageDataHelper.setMetaDatasAttr(metricPage.metaData, pageData);
    metricPage.actions = {};
    // TODO: reservas.
    return metricPage;
}
