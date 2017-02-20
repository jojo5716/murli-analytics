const projectSchema = require('../models/projectSchema');

function getAll(callback) {
    projectSchema.find({}, (err, projects) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, { projects });
        }
    });
}

module.exports = {
    getAll
};
