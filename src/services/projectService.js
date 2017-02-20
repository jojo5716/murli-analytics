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

function getById(id, callback) {
    projectSchema.findOne({_id: id }, (err, project) => {
        if (err) {
            callback({ error: err });
        } else {
            callback(null, project);
        }
    });
}
module.exports = {
    getAll,
    getById
};
