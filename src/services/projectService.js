const projectSchema = require('../models/projectSchema');

module.exports = {
    getAll,
    getById
};

/**
 * Get all project
 *
 * @param {any} callback
 */
async function getAll() {
    return await projectSchema.find({});
}

/**
 * Get project by ID
 *
 * @param {string} id
 * @param {any} callback
 */
async function getById(id) {
    return await projectSchema.findOne({_id: id });
}
