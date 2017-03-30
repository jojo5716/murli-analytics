const uuid = require('uuid');

module.exports = (function analyticsSchema() {
    const mongoose = require('../database').mongoose;

    const analyticsModel = {
        name: { type: String, required: true },
        createAt: { type: Date, default: Date.now },
        metrics: { type: Array, default: [] },
        dimensions: { type: Array, default: [] },
        filters: { type: Array, default: [] },
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
    };

    const collectionName = 'Analytics';
    const analyticsSchema = mongoose.Schema(analyticsModel);
    const Analytics = mongoose.model(collectionName, analyticsSchema);

    return Analytics;
})();
