const uuid = require('uuid');

module.exports = (function projectSchema() {
    const mongoose = require('../database').mongoose;

    const projectModel = {
        _id: {
            type: String,
            default: () =>
                uuid.v4()
        },
        name: { type: String, required: true },
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'Project';
    const projectSchema = mongoose.Schema(projectModel);
    const Project = mongoose.model(collectionName, projectSchema);

    return Project;
})();
