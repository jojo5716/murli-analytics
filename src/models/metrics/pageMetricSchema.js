module.exports = (function metricPageSchema() {
    const mongoose = require('../../database').mongoose;

    const metricPageModel = {
        type: { type: String, required: true },
        project: { type: String, required: true },
        createAt: { type: Date, default: Date.now },
        month: { type: String, required: true },
        year: { type: String, required: true },
        pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PageVisits' }],
    };

    const collectionName = 'MetricPage';
    const metricPageSchema = mongoose.Schema(metricPageModel);
    const MetricPage = mongoose.model(collectionName, metricPageSchema);

    return MetricPage;
})();
