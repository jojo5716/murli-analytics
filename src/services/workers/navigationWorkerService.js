const kue = require('kue');

const queue = kue.createQueue();


module.exports = {
    accumulateMetricsPageVisit
}

/**
 * Service to send job to accumulate data about current page visited.
 *
 * Metrics to accumulate:
 *    Url visits (integer)
 *    Previous url visited (integer)
 *
 * @param {object} data
 */
function accumulateMetricsPageVisit(pageData) {
    queue
        .create('accumulateMetricsPageVisit', pageData)
        .save()
}