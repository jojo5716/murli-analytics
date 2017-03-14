const navigationSchema = require('../models/navigationSchema');

function create(args, callback) {
    navigationSchema.create(args, (err, page) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, page);
        }
    });
}

function getAll(callback) {
    navigationSchema.find({}, (err, pages) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, pages);
        }
    });
}

function getBySession(sessionTemp, callback) {
    navigationSchema.findOne({ sessionTemp }, (err, page) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, page);
        }
    });
}

function getByProject(project, callback) {
    navigationSchema.findOne({ project: project._id }, (err, page) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, page);
        }
    });
}

module.exports = {
    create,
    getAll,
    getBySession,
    getByProject
};
