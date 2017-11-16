const pageDataHelper = require('../../helpers/pageData');
const { getUserAgentInfo, userAgentDeviceInfo } = require('../../utilities/userAgent');


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
 * @param {string} today date
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

    if (!deviceListClone[today]) {
        deviceListClone[today] = {};
    }
    if (!deviceListClone[today][deviceName]) {
        deviceListClone[today][deviceName] = {};
    }

    if (!deviceListClone[today][deviceName][deviceModel]) {
        deviceListClone[today][deviceName][deviceModel] = {};
    }

    if (!deviceListClone[today][deviceName][deviceModel][osName]) {
        deviceListClone[today][deviceName][deviceModel][osName] = {};
    }

    if (!deviceListClone[today][deviceName][deviceModel][osName][osVersion]) {
        deviceListClone[today][deviceName][deviceModel][osName][osVersion] = {};
    }

    if (!deviceListClone[today][deviceName][deviceModel][osName][osVersion][browserName]) {
        deviceListClone[today][deviceName][deviceModel][osName][osVersion][browserName] = {};
    }

    if (!deviceListClone[today][deviceName][deviceModel][osName][osVersion][browserName][browserVersion]) {
        deviceListClone[today][deviceName][deviceModel][osName][osVersion][browserName][browserVersion] = 0;
    }

    // Increment a new visit for the device
    deviceListClone[today][deviceName][deviceModel][osName][osVersion][browserName][browserVersion] += 1;

    return deviceListClone;
}

/**
 * Update countries visits for page visit metric
 *
 * @param {string} today date
 * @param {object} countries
 * @param {object} pageData
 * @returns {object} Countries visit updated
 */
function updateCountriesVisit(today, countries, pageData) {
    const countryVisit = pageDataHelper.getCountry(pageData);

    if (!countries[today]) {
        countries[today] = {};
    }
    if (!countries[today][countryVisit]) {
        countries[today][countryVisit] = 0;
    }

    countries[today][countryVisit] += 1;

    return countries;
}

/**
 * Update users visits for page visit metric
 *
 * @param {string} today date
 * @param {object} userVisits
 * @param {string} userID
 * @returns {object} User visit updated
 */
function updateUserVisit(today, userVisits, userID) {
    if (!userVisits[today]) {
        userVisits[today] = {};
    }

    if (!userVisits[today][userID]) {
        userVisits[today][userID] = 0;
    }

    userVisits[today][userID] += 1;

    return userVisits;
}


/**
 * Update all metaData metrics into a page visit metric like attrs of the own object
 *
 * @param {string} today date
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

        if (!metricMetaData[today]) {
            metricMetaData[today] = {};
        }

        if (!metricMetaData[today][metaDataName]) {
            metricMetaData[today][metaDataName] = {};
        }

        if (!metricMetaData[today][metaDataName][metaDataValue]) {
            metricMetaData[today][metaDataName][metaDataValue] = 0;
        }

        metricMetaData[today][metaDataName][metaDataValue] += 1;
    }

    return metricMetaData;
}

function updateAvailabilityInfo(metricMetaData, pageData) {
    const availabilityInfo = pageData.data.availability;

    console.log(`availabilityInfo: ${availabilityInfo}`);

}

/**
 * Update all visits for a day
 *
 * @param {string} today
 * @param {object} metricVisits
 * @returns {object} Visits updated
 */
function updateTotalVisits(today, metricVisits) {
    if (!metricVisits[today]) {
        metricVisits[today] = 0;
    }

    metricVisits[today] += 1;

    return metricVisits;
}

/**
 * Update all visits in a hour for a day
 *
 * @param {string} today
 * @param {object} metricHours
 * @returns {object} Hours visits updated
 */
function updateHoursVisits(today, metricHours, pageData) {
    const loadedOn = pageDataHelper.getLoadedOn(pageData);
    const hourVisit = pageDataHelper.getAtHourVisit(loadedOn);

    if (!metricHours[today]) {
        metricHours[today] = {};
    }

    if (!metricHours[today][hourVisit]) {
        metricHours[today][hourVisit] = 0;
    }

    metricHours[today][hourVisit] += 1;

    return metricHours;
}

/**
 * Update all previous url visits in a day
 *
 * @param {string} today
 * @param {object} metricURLs
 * @returns {object} Hours visits updated
 */
function updatePreviousURLVisits(today, metricURLs, pageData) {
    const previousUrl = pageDataHelper.getPreviousUrl(pageData);
    const previousUrlFormated = previousUrl.replaceAll('.', '#');

    if (!metricURLs[today]) {
        metricURLs[today] = {};
    }

    if (!metricURLs[today][previousUrlFormated]) {
        metricURLs[today][previousUrlFormated] = 0;
    }

    metricURLs[today][previousUrlFormated] += 1;

    return metricURLs;
}
