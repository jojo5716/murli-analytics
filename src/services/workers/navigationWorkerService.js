const pageMetricSchema = require('../../models/metrics/pageMetricSchema');
const pageVisitSchema = require('../../models/metrics/pageVisitSchema');


module.exports = {
    createPageMetric,
    createPageVisit,
    updatePage,
    findPageVisitByURL,
    findMetricRowByQuery
};


async function findMetricRowByQuery(query) {
    return await pageMetricSchema
        .findOne(query)
        .populate('pages');
}

/**
 * Create a new page Metric model
 *
 * @param {object} args
 * @returns {object} Metric page
 */
async function createPageMetric(args) {
    return await pageMetricSchema.create(args);
}

/**
 * Create a new page visit metrics
 *
 * @param {object} args
 * @returns {object} Page visit model
 */
async function createPageVisit(args) {
    return await pageVisitSchema.create(args);
}

/**
 * Find and return an page visit model from url
 *
 * @param {string} pageURL
 * @returns {object} Page visit
 */
async function findPageVisitByURL(pageURL) {
    return await pageVisitSchema.findOne({ url: pageURL });
}

/**
 * Update a page visit model
 *
 * @param {string} url
 * @param {object} pageVisitUpdated
 * @returns {object} Page visit
 */
async function updatePage(url, pageVisitUpdated) {
    return await pageVisitSchema.update({ 'url': url }, pageVisitUpdated);
}
