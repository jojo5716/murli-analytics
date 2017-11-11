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
 * @param {any} data
 * @param {any} done
 */
function accumulateMetricsPageVisit(data, done) {
    queue.create('accumulateMetricsPageVisit', { title: 'hola' })
        .save()
}