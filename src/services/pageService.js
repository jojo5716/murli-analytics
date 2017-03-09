const pageSchema = require('../models/pageSchema');
const navigationSchema = require('../models/navigationSchema');


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
    pageSchema.find({}, (err, pages) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, pages);
        }
    });
}

function getByToken(pageToken, callback) {
    pageSchema.findOne({ pageToken }, (err, page) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, page);
        }
    });
}

function getByCreate(dateFrom, dateTo, callback) {
    navigationSchema.find(
        {
            createAt: {
                $gte: dateFrom,
                $lte: dateTo
            }
        }).populate(['pages', 'user']).exec((err, user) => {
            if (err) {
                callback({ error: err });
            } else {
                callback(null, user);
            }
        });
}

module.exports = {
    create,
    getAll,
    getByToken,
    getByCreate
};
