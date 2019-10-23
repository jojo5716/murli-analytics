const kue = require('kue');
const config = require('../../config');

const queue = kue.createQueue({ redis: config.redisPath });

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