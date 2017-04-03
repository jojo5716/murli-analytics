module.exports = (function projectSchema() {
    const mongoose = require('../database').mongoose;

    const projectModel = {
        name: { type: String, required: true },
        analytics: { type: String, required: false },
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'Project';
    const projectSchema = mongoose.Schema(projectModel);
    const Project = mongoose.model(collectionName, projectSchema);

    return Project;
})();
