const mongoose = require('mongoose');

const analyticsSchema = require('../models/analyticsSchema');

function createReport(args, callback) {
    analyticsSchema.create(args, (err, page) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, page);
        }
    });
}

function getAll(callback) {
    analyticsSchema.find({})
        .populate(['projects'])
        .exec((err, reports) => {
            if (err) {
                callback(err);
            } else {
                callback(null, reports);
            }
        });
}

function getByProject(project, callback) {

    analyticsSchema.find({ projects: { '$in': [project] } }, (err, reports) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, reports);
        }
    });
}

module.exports = {
    createReport,
    getAll,
    getByProject
};
