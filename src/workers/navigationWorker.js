module.exports = {
    accumulateMetricsPageVisit
}
/**
 * When a user visit a page, we increment the visit number for that url
 *
 */
function accumulateMetricsPageVisit(done) {
    console.log("Accumulating url visit...");
    done();
}