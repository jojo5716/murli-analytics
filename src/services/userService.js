const userSchema = require('../models/userSchema');

function create(data, callback) {
    userSchema.create({
        dataUser: data.data.enviroment[0],
        session: data.data.session
    }, (err, user) => {
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

module.exports = {
    create,
    getAll,
    getBySession
};
