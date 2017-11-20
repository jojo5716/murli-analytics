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
 * @param {array} keysPath
 * @param {object} devicesPage
 * @param {object} pageData
 * @returns {object} Devices visits
 */
function updateDeviceVisit(keysPath, devicesPage, pageData) {
    const userAgent = pageDataHelper.getUserAgent(pageData);
    const userAgentInfo = getUserAgentInfo(userAgent);
    let keyPathClone = keysPath.slice(0);
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
        deviceName,
        deviceModel,
        osName,
        osVersion,
        browserName,
        browserVersion
    ];

    keyPathClone = keyPathClone.concat(devicesObjectStructure);

    const currentDeviceVisits = objectTools.getValueFromNestedObject(devicesPage, keyPathClone, 0);

    return objectTools.createNestedObject(devicesPage, keyPathClone, currentDeviceVisits + 1);
}

/**
 * Update countries visits for page visit metric
 *
 * @param {array} keysPath
 * @param {object} countries
 * @param {object} pageData
 * @returns {object} Countries visit updated
 */
function updateCountriesVisit(keysPath, countries, pageData) {
    const countryCodeVisit = pageDataHelper.getCountry(pageData);
    const keyPathClone = keysPath.slice(0);

    keyPathClone.push(countryCodeVisit);
    const currentCountyVisits = objectTools.getValueFromNestedObject(countries, keyPathClone, 0);


    return objectTools.createNestedObject(countries, keyPathClone, currentCountyVisits + 1);
}

/**
 * Update users visits for page visit metric
 *
 * @param {array} keysPath
 * @param {object} userVisits
 * @param {string} userID
 * @returns {object} User visit updated
 */
function updateUserVisit(keysPath, userVisits, userID) {
    const keyPathClone = keysPath.slice(0);

    // Adding user id to nested object
    keyPathClone.push(userID);

    const currentUserVisits = objectTools.getValueFromNestedObject(userVisits, keyPathClone, 0);

    return objectTools.createNestedObject(userVisits, keyPathClone, currentUserVisits + 1);
}


/**
 * Update all metaData metrics into a page visit metric like attrs of the own object
 *
 * @param {array} keysPath
 * @param {object} metricMetaData
 * @param {object} pageData
 * @returns {object} Metadata object
 */
function updateMetaDatasAttr(keysPath, metricMetaData, pageData) {
    const metaDatas = pageData.data.metaData;


    for (let i = 0; i < metaDatas.length; i += 1) {
        const metaData = metaDatas[i];
        const metaDataName = metaData.key.replaceAll('.', '#');
        const metaDataValue = metaData.value.replaceAll('.', '#');;

        let keysPathClone = keysPath.slice(0);

        keysPathClone = keysPathClone.concat([metaDataName, metaDataValue]);
        const currentMetaDataValue = objectTools.getValueFromNestedObject(metricMetaData, keysPathClone, 0);
        // Updating metadata values
        objectTools.createNestedObject(metricMetaData, keysPathClone, currentMetaDataValue + 1);
    }

    return metricMetaData;
}

function updateAvailabilityInfo(keysPath, availabilityData, pageData) {
    const availabilityRoomsInfo = pageData.data.availability[0];

    if (availabilityRoomsInfo) {
        const currentAvailabilities = objectTools.getValueFromNestedObject(availabilityData, keysPath, []);
        currentAvailabilities.push(availabilityRoomsInfo.value);

        return objectTools.createNestedObject(availabilityData, keysPath, currentAvailabilities);
    }


}

/**
 * Update all visits for a day
 *
 * @param {array} keysPath
 * @param {object} metricVisits
 * @returns {object} Visits updated
 */
function updateTotalVisits(keysPath, metricVisits) {
    const currentTotalVisits = objectTools.getValueFromNestedObject(metricVisits, keysPath, 0);

    return objectTools.createNestedObject(metricVisits, keysPath, currentTotalVisits + 1);
}

/**
 * Update all previous url visits in a day
 *
 * @param {array} keysPath
 * @param {object} metricURLs
 * @param {object} pageData
 * @returns {object} Hours visits updated
 */
function updatePreviousURLVisits(keysPath, metricURLs, pageData) {
    const previousUrl = pageDataHelper.getPreviousUrl(pageData);
    const previousUrlFormated = previousUrl.replaceAll('.', '#');
    const keyPathClone = keysPath.slice(0);

    keyPathClone.push(previousUrlFormated);

    const currentpreviousUrlVisits = objectTools.getValueFromNestedObject(metricURLs, keyPathClone, 0);

    return objectTools.createNestedObject(metricURLs, keyPathClone, currentpreviousUrlVisits + 1);
}
