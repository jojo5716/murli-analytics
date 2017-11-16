const kue = require('kue');

const queue = kue.createQueue();

module.exports = {
    accumulateMetricsBookings
};

/**
 * Accumulate metrics about bookings
 *
 * @param {object} Navigation
 * @param {object} booking
 *
 */
function accumulateMetricsBookings(navigation, booking) {
    queue
        .create('accumulateMetricsBookings', {navigation, booking})
        .save()
}