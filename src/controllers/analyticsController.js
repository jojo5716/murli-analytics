const Promise = require('promise');
const _ = require('lodash');

const analyticsService = require('../services/analyticsService');
const { getProject } = require('../helpers/project');


function analyticsController() {

    this.createReport = (req, res) => {
        const data = JSON.parse(req.body);

        const projectPromise = new Promise(getProject.bind(this, req.params.project)).then(project => {
           if (project) {

               const reportData = {
                   name: data.reportData.name,
                   metrics: data.reportData.metrics,
                   dimensions: data.reportData.dimensions,
                   filters: data.reportData.filters,
                   projects: [project]
               };

               analyticsService.createReport(reportData, (err, report) => {
                    if (err || !report) {
                        res.json(err);
                    } else {
                        res.json({ success: true });
                    }
               });
           } else {
               res.json({ success: false });
           }
        });
    };


    this.getReports = (req, res) => {
        const projectPromise = new Promise(getProject.bind(this, req.params.project))
            .then(project => {

                if (project) {
                    let reportsProject = [];
                    analyticsService.getAll((err, reports) => {
                        res.json({ reports });
                    });
                }
            })

            .catch(err => res.json({err}) );
    };

    this.getAllReports = (req, res) => {
        analyticsService.getAll((err, reports) => {
            res.json({ reports });
        });
    };

    return this;
}

module.exports = new analyticsController();
