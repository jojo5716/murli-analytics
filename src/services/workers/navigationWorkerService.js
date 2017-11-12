const kue = require('kue');
const pageMetricSchema = require('../../models/metrics/pageMetricSchema');

const queue = kue.createQueue();


module.exports = {
    findMetricRowByType,
    create,
    accumulateMetricsPageVisit
}

async function findMetricRowByType(project, type) {
    return await pageMetricSchema.findOne({ project, type });
}

async function create(args) {
    return await pageMetricSchema.create(args);
}

/**
 * Service to send job to accumulate data about current page visited.
 *
 * Metrics to accumulate:
 *    Url visits (integer)
 *    Previous url visited (integer)
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