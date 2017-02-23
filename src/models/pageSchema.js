module.exports = (function pageSchema() {
    const mongoose = require('../database').mongoose;

    const pageModel = {
        sessionTemp: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        pages: { type: Array, default: [] },
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'Page';
    const pageSchema = mongoose.Schema(pageModel);
    const Page = mongoose.model(collectionName, pageSchema);

    return Page;
})();
