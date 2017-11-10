const projectSchema = require('../models/projectSchema');

module.exports = {
    getAll,
    getById
};

/**
 * Get all project
 *
 */
async function getAll() {
    return await projectSchema.find({});
}

/**
 * Get project by ID
 *
 * @param {string} id
 */
async function getById(id) {
    return await projectSchema.findOne({_id: id });
}
