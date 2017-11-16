const kue = require('kue');

const pageMetricSchema = require('../../models/metrics/pageMetricSchema');
const pageVisitSchema = require('../../models/metrics/pageVisitSchema');

const queue = kue.createQueue();


module.exports = {
    create,
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions,
    createPageVisit,
    updatePage,
    findPageVisitByURL,
    findMetricRowByQuery,
    accumulateMetricsBookings
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
async function create(args) {
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

/**
 * Service to send job to accumulate data about current page visited.
 *
 * Metrics to accumulate:
 *    Url visits (integer)
 *    Previous url visited (integer)
 *    Device visit info
 *    Bookings
 *    Country visits
 *
 * @param {string} userID
 * @param {object} data
 */
function accumulateMetricsPageVisit(userID, pageData) {
    const pageDataClone = Object.assign({}, pageData);

    // We need to add the user id to register on the metrics
    pageDataClone.userID = userID;

    queue
        .create('accumulateMetricsPageVisit', pageDataClone)
        .save()
}


function accumulateMetricsPageActions(pageData) {
    queue
        .create('accumulateMetricsPageActions', pageData)
        .save()
}

function accumulateMetricsBookings(navigation, booking) {
    queue
        .create('accumulateMetricsBookings', {navigation, booking})
        .save()
}