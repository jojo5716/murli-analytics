const pageDataHelper = require('../../helpers/pageData');
const { getUserAgentInfo, userAgentDeviceInfo } = require('../../utilities/userAgent');
const workerHelper = require('../../helpers/workers/page');


module.exports = {
    updateDeviceVisit,
    updateCountriesVisit,
    updateUserVisit,
    updateMetaDatasAttr,
    updateAvailabilityInfo,
    updateTotalVisits,
    updateHoursVisits,
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

    if (!deviceListClone[today.stringDate]) {
        deviceListClone[today.stringDate] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime]) {
        deviceListClone[today.stringDate][today.currentTime] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime][deviceName]) {
        deviceListClone[today.stringDate][today.currentTime][deviceName] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel]) {
        deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName]) {
        deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion]) {
        deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion][browserName]) {
        deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion][browserName] = {};
    }

    if (!deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion][browserName][browserVersion]) {
        deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion][browserName][browserVersion] = 0;
    }

    // Increment a new visit for the device
    deviceListClone[today.stringDate][today.currentTime][deviceName][deviceModel][osName][osVersion][browserName][browserVersion] += 1;

    return deviceListClone;
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
    const countryVisit = pageDataHelper.getCountry(pageData);

    if (!countries[today.stringDate]) {
        countries[today.stringDate] = {};
    }

    if (!countries[today.stringDate][today.currentTime]) {
        countries[today.stringDate][today.currentTime] = {};
    }

    if (!countries[today.stringDate][today.currentTime][countryVisit]) {
        countries[today.stringDate][today.currentTime][countryVisit] = 0;
    }

    countries[today.stringDate][today.currentTime][countryVisit] += 1;

    return countries;
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

    if (!userVisits[today.stringDate]) {
        userVisits[today.stringDate] = {};
    }

    if (!userVisits[today.stringDate][today.currentTime]) {
        userVisits[today.stringDate][today.currentTime] = {};
    }

    if (!userVisits[today.stringDate][today.currentTime][userID]) {
        userVisits[today.stringDate][today.currentTime][userID] = 0;
    }

    userVisits[today.stringDate][today.currentTime][userID] += 1;

    return userVisits;
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

    return availabilityData;
}

/**
 * Update all visits for a day
 *
 * @param {object} today
 * @param {object} metricVisits
 * @returns {object} Visits updated
 */
function updateTotalVisits(today, metricVisits) {
    // metricVisits = workerHelper.initializerMetricDateTime(today, metricVisits, 0);

    if (!metricVisits[today.stringDate]) {
        metricVisits[today.stringDate] = {};
    }

    if (!metricVisits[today.stringDate][today.currentTime]) {
        metricVisits[today.stringDate][today.currentTime] = 0;
    }

    metricVisits[today.stringDate][today.currentTime] += 1;

    return metricVisits;
}

/**
 * Update all visits in a hour for a day
 *
 * @param {object} today
 * @param {object} metricHours
 * @returns {object} Hours visits updated
 */
function updateHoursVisits(today, metricHours) {

    if (!metricHours[today.stringDate]) {
        metricHours[today.stringDate] = {};
    }

    if (!metricHours[today.stringDate][today.currentTime]) {
        metricHours[today.stringDate][today.currentTime] = 0;
    }


    metricHours[today.stringDate][today.currentTime] += 1;

    return metricHours;
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

    if (!metricURLs[today.stringDate]) {
        metricURLs[today.stringDate] = {};
    }

    if (!metricURLs[today.stringDate][today.currentTime]) {
        metricURLs[today.stringDate][today.currentTime] = {};
    }

    if (!metricURLs[today.stringDate][today.currentTime][previousUrlFormated]) {
        metricURLs[today.stringDate][today.currentTime][previousUrlFormated] = 0;
    }

    metricURLs[today.stringDate][today.currentTime][previousUrlFormated] += 1;

    return metricURLs;
}
