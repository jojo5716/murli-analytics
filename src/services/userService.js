const userSchema = require('../models/userSchema');

function create(data, callback) {
    userSchema.create(data, (err, user) => {
        if (err) {
            callback(err);
        } else {
            callback(null, user);
        }
    });
}

function getAll(callback) {
    userSchema.find({}, (err, data) => {
        if (err) {
            callback({ error: err });
        } else {
            callback(null, data);
        }
    });
}

function getBySession(session, callback) {
    userSchema.findOne({ session }, (err, user) => {
        if (err) {
            callback({ error: err });
        } else {
            callback(null, user);
        }
    });
}

function getByCreate(dateFrom, dateTo, callback) {
    userSchema.find({ createAt: { $gte: dateFrom, $lte: dateTo } }, (err, user) => {
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
    getBySession,
    getByCreate
};
