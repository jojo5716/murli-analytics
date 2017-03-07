module.exports = (function navigationSchema() {
    const mongoose = require('../database').mongoose;

    const navigationModel = {
        sessionTemp: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'Navigation';
    const navigationSchema = mongoose.Schema(navigationModel);
    const Navigation = mongoose.model(collectionName, navigationSchema);

    return Navigation;
})();
