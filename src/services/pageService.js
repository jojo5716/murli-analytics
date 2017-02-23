const pageSchema = require('../models/pageSchema');

function create(args, callback) {
    pageSchema.create(args, (err, page) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, page);
        }
    });
}

function getAll(callback) {
    pageSchema.find({}, (err, data) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, { data });
        }
    });
}

function getBySession(sessionTemp, callback) {
    pageSchema.findOne({ sessionTemp }, (err, page) => {
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
    getBySession
};
