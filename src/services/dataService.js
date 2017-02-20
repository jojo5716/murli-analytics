const dataSchema = require('../models/dataSchema');

function getAll(callback) {
    dataSchema.find({}, (err, data) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, { data });
        }
    });
}

module.exports = {
    getAll
};
