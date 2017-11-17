const pageDataHelper = require('../../helpers/pageData');
const { getUserAgentInfo, userAgentDeviceInfo } = require('../../utilities/userAgent');
const objectTools = require('../../utilities/objects');


module.exports = {
    updateDeviceVisit,
    updateCountriesVisit,
    updateUserVisit,
    updateMetaDatasAttr,
    updateAvailabilityInfo,
    updateTotalVisits,
    updatePreviousURLVisits
};

/**
 * Update an object of devices visits
 *
 * @param {object} today date
 * @param {object} devicesPage
 * @param {object} pageData
 * @returns {object} Devices visits
 */
function updateDeviceVisit(today, devicesPage, pageData) {
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

    const devicesObjectStructure = [
        today.stringDate,
        today.currentTime,
        deviceName,
        deviceModel,
        osName,
        osVersion,
        browserName,
        browserVersion
    ];

    const currentDeviceVisits = objectTools.getValueFromNestedObject(devicesPage, devicesObjectStructure, 0);

    return objectTools.createNestedObject(devicesPage, devicesObjectStructure, currentDeviceVisits + 1);
}

/**
 * Update countries visits for page visit metric
 *
 * @param {object} today date
 * @param {object} countries
 * @param {object} pageData
 * @returns {object} Countries visit updated
 */
function updateCountriesVisit(today, countries, pageData) {
    const countryCodeVisit = pageDataHelper.getCountry(pageData);
    const countryObjectStructure = [
        today.stringDate,
        today.currentTime,
        countryCodeVisit
    ];

    const currentCountyVisits = objectTools.getValueFromNestedObject(countries, countryObjectStructure, 0);


    return objectTools.createNestedObject(countries, countryObjectStructure, currentCountyVisits + 1);
}

/**
 * Update users visits for page visit metric
 *
 * @param {object} today date
 * @param {object} userVisits
 * @param {string} userID
 * @returns {object} User visit updated
 */
function updateUserVisit(today, userVisits, userID) {
    const usersObjectStructure = [
        today.stringDate,
        today.currentTime,
        userID
    ];

    const currentUserVisits = objectTools.getValueFromNestedObject(userVisits, usersObjectStructure, 0);

    return objectTools.createNestedObject(userVisits, usersObjectStructure, currentUserVisits + 1);
}


/**
 * Update all metaData metrics into a page visit metric like attrs of the own object
 *
 * @param {object} today date
 * @param {object} metricMetaData
 * @param {object} pageData
 * @returns {object} Metadata object
 */
function updateMetaDatasAttr(today, metricMetaData, pageData) {
    const metaDatas = pageData.data.metaData;

    for (let i = 0; i < metaDatas.length; i += 1) {
        const metaData = metaDatas[i];
        const metaDataName = metaData.key.replaceAll('.', '#');
        const metaDataValue = metaData.value.replaceAll('.', '#');;

        if (!metricMetaData[today.stringDate]) {
            metricMetaData[today.stringDate] = {};
        }

        if (!metricMetaData[today.stringDate][today.currentTime]) {
            metricMetaData[today.stringDate][today.currentTime] = {};
        }

        if (!metricMetaData[today.stringDate][today.currentTime][metaDataName]) {
            metricMetaData[today.stringDate][today.currentTime][metaDataName] = {};
        }

        if (!metricMetaData[today.stringDate][today.currentTime][metaDataName][metaDataValue]) {
            metricMetaData[today.stringDate][today.currentTime][metaDataName][metaDataValue] = 0;
        }

        metricMetaData[today.stringDate][today.currentTime][metaDataName][metaDataValue] += 1;
    }

    return metricMetaData;
}

function updateAvailabilityInfo(today, availabilityData, pageData) {
    const availabilityRoomsInfo = pageData.data.availability[0];

    if (!availabilityData[today.stringDate]) {
        availabilityData[today.stringDate] = {};
    }

    if (!availabilityData[today.stringDate][today.currentTime]) {
        availabilityData[today.stringDate][today.currentTime] = [];
    }

    availabilityData[today.stringDate][today.currentTime].push(availabilityRoomsInfo.value);

}

/**
 * Update all visits for a day
 *
 * @param {object} today
 * @param {object} metricVisits
 * @returns {object} Visits updated
 */
function updateTotalVisits(today, metricVisits) {

    const visitsObjectStructure = [
        today.stringDate,
        today.currentTime
    ];

    const currentTotalVisits = objectTools.getValueFromNestedObject(metricVisits, visitsObjectStructure, 0);

    return objectTools.createNestedObject(metricVisits, visitsObjectStructure, currentTotalVisits + 1);
}

/**
 * Update all previous url visits in a day
 *
 * @param {object} today
 * @param {object} metricURLs
 * @returns {object} Hours visits updated
 */
function updatePreviousURLVisits(today, metricURLs, pageData) {

    const previousUrl = pageDataHelper.getPreviousUrl(pageData);
    const previousUrlFormated = previousUrl.replaceAll('.', '#');

    const previousUrlObjectStructure = [
        today.stringDate,
        today.currentTime,
        previousUrlFormated
    ];

    const currentpreviousUrlVisits = objectTools.getValueFromNestedObject(metricURLs, previousUrlObjectStructure, 0);

    return objectTools.createNestedObject(metricURLs, previousUrlObjectStructure, currentpreviousUrlVisits + 1);
}
