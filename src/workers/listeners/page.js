const kue = require('kue');
const { accumulateMetricsPageVisit, accumulateMetricsPageActions } = require('../navigationWorker');

const queue = kue.createQueue();


queue.process('accumulateMetricsPageVisit', 2, (job, done) => {
    //call job implementation with required parameters.
    accumulateMetricsPageVisit(job.data, done);
});

queue.process('accumulateMetricsPageActions', 2, (job, done) => {
    //call job implementation with required parameters.
    accumulateMetricsPageActions(job.data, done);
});
