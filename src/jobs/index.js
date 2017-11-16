const {
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions
} = require('./pageMetrics');

const {
    accumulateMetricsBookings
} = require('./bookingMetrics');


module.exports = {
    // Page visit metrics
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions,

    // Booking metrics
    accumulateMetricsBookings
};
