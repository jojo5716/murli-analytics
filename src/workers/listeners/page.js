const kue = require('kue');
const { accumulateMetricsPageVisit } = require('../navigationWorker');

const queue = kue.createQueue();


queue.process('accumulateMetricsPageVisit', 2, (job, done) => {
    //call job implementation with required parameters.
    accumulateMetricsPageVisit(done);
});
