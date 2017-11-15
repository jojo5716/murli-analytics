
module.exports = {
    getAtHourVisit,
    getUrlFromPageData,
    getLoadedOn,
    getPreviousUrl,
    getUserAgent,
    getCountry,
    setMetaDatasAttr
}


/**
 * Return an hour integer from milliseconds time
 *
 * @param {float} pageLoadedOn
 * @returns {integer} Hour
 */
function getAtHourVisit(pageLoadedOn) {
    return new Date(pageLoadedOn).getHours();
}


/**
 * Get url page from page data
 *
 * @param {object} pageData
 * @returns {string} url
 */
function getUrlFromPageData(pageData) {
    return pageData.data.page[0].url;
}

/**
 * Get loaded on time for a page
 *
 * @param {object} pageData
 * @returns {integer} Page loaded on
 */
function getLoadedOn(pageData) {
    return pageData.data.loadedOn;
}

/**
 * Get previous url
 *
 * @param {object} pageData
 * @returns {string} previous url
 */
function getPreviousUrl(pageData) {
    return pageData.data.page[0].previousURL;
}

/**
 * Return an user agent from pageData
 *
 * @param {object} pageData
 * @returns {string} Useragent
 */
function getUserAgent(pageData) {
    return pageData.data.enviroment[0].userAgent;
}

/**
 * Get Country from pageData
 *
 * @param {object} pageData
 * @returns {string} Country
 */
function getCountry(pageData) {
    const userData = pageData.data.userInfo;
    const countryData = userData.filter((item) => item.key == 'country')[0];

    return countryData.value;
}

/**
 * Save all metaData into a page visit metric like attrs of the own object
 *
 * @param {object} metricMetaData
 * @param {object} pageData
 * @returns {object} Metadata object
 */
function setMetaDatasAttr(metricMetaData, pageData) {
    const metaDatas = pageData.data.metaData;

    for (let i = 0; i < metaDatas.length; i += 1) {
        const metaData = metaDatas[i];
        const metaDataName = metaData.key.replaceAll('.', '#');
        const metaDataValue = metaData.value.replaceAll('.', '#');;

        if (!metricMetaData[metaDataName]) {
            metricMetaData[metaDataName] = {};
        }

        if (!metricMetaData[metaDataName][metaDataValue]) {
            metricMetaData[metaDataName][metaDataValue] = 0;
        }

        metricMetaData[metaDataName][metaDataValue] += 1;
    }

    return metricMetaData;
}
