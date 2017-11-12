const pageHelper = require('../../helpers/page');


module.exports = {
    getAtHourVisit,
    generateBasicMetricPageSchema,
    updateMetricPageContent
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
 * Generate a basic schema of metric page
 *
 * @param {string} url
 * @returns {object} Empty schema of Metric page
 */
function generateBasicMetricPageSchema(url) {
    return {
        url,
        visits: 0,
        users: [],
        atHours: [],
        users: [],
        previousUrl: []
    }
}

function updateMetricPageContent(metricPage, pageData) {
    const metricPageClone = Object.assign({}, metricPage);
    const loadedOn = pageHelper.getLoadedOn(pageData);

    metricPageClone.visits += 1;
    metricPageClone.atHours.push(getAtHourVisit(loadedOn));
    metricPageClone.previousUrl.push(pageHelper.getPreviousUrl(pageData));
    metricPageClone.users.push(pageData.userID);

    // TODO: Guardar información sobre el dispositivo, navegador, pais y metaDatas, acciones y reservas.
    return metricPageClone;
}