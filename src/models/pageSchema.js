module.exports = (function pageSchema() {
    const mongoose = require('../database').mongoose;

    const pageModel = {
        createAt: { type: Date, default: Date.now },
        url: { type: String, required: true },
        previousURL: { type: String, required: false },
        leavesAt: { type: Number, required: false },
        loadedOn: { type: Number, required: false },
        pageToken: { type: String, required: true },
        metaData: { type: Array, default: [] },
        actions: { type: Array, default: [] }
    };

    const collectionName = 'Page';
    const pageSchema = mongoose.Schema(pageModel);
    const Page = mongoose.model(collectionName, pageSchema);

    return Page;
})();
