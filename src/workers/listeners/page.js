const kue = require('kue');
const {
    accumulateMetricsPageVisit,
    accumulateMetricsPageActions,
    accumulateMetricsBookings
} = require('../navigationWorker');

const queue = kue.createQueue();


queue.process('accumulateMetricsPageVisit', 50, (job, done) => {
    //call job implementation with required parameters.
    accumulateMetricsPageVisit(job.data, done);
});

queue.process('accumulateMetricsPageActions', 50, (job, done) => {
    //call job implementation with required parameters.
    accumulateMetricsPageActions(job.data, done);
});

queue.process('accumulateMetricsBookings', 50, (job, done) => {
    //call job implementation with required parameters.
    accumulateMetricsBookings(job.data, done);
});
