const kue = require('kue');

const queue = kue.createQueue();


module.exports = {
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions
};

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

/**
 * Accumulate metrics about user actions on a page
 *
 * @param {object} pageData
 *
 */
function accumulateMetricsPageActions(pageData) {
    queue
        .create('accumulateMetricsPageActions', pageData)
        .save()
}
