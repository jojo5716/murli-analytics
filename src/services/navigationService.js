const navigationSchema = require('../models/navigationSchema');

const PAGE_SIZE = 100;

function create(args, callback) {
    navigationSchema.create(args, (err, page) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, page);
        }
    });
}

/**
 * Get all navigations (paginated)
 *
 * @param {any} page The page to retrieve
 * @param {any} callback
 */
function getAll(page, callback) {
    navigationSchema
        .find()
        .populate(['pages', 'user'])
        .skip(PAGE_SIZE * (page-1))
        .limit(PAGE_SIZE)
        .exec((err, pages) => {
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
    const query = {
        createAt: {
            $gte: dateFrom,
            $lte: dateTo
        }
    }

    if (project) {
        query.project = project;
    }

    navigationSchema
        .find(query)
        .populate(['pages', 'user'])
        .skip(PAGE_SIZE * (page-1))
        .limit(PAGE_SIZE)
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
