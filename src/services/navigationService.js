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

/**
 * Get all navigations, along with their pages and users
 * that were created within the given date range
 *
 * @param {any} dateFrom
 * @param {any} dateTo
 * @param {any} project
 * @param {any} callback
 */
function getAllByCreationDate(dateFrom, dateTo, project, page=1, callback) {
    const pageSize = 100;
    const query = {
        createAt: {
            $gte: dateFrom,
            $lte: dateTo
        }
    }
    if (project) {
        query.project = project;
    }
    navigationSchema.find(query)
        .populate(['pages', 'user'])
        .skip(pageSize * (page-1))
        .limit(pageSize)
        .sort({ createAt: 1 })
        .exec((err, navigationPages) => {
            if (err) {
                callback({ error: err });
            } else {
                callback(null, navigationPages);
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

function getByProject(project, sessionTemp, callback) {
    navigationSchema.findOne({ project: project._id, sessionTemp }, (err, page) => {
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
    getAllByCreationDate,
    getBySession,
    getByProject
};
