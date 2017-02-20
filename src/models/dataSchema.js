module.exports = (function dataSchema() {
    const mongoose = require('../database').mongoose;

    const dataModel = {
        data: { type: Object, required: true },
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'Data';
    const dataSchema = mongoose.Schema(dataModel);
    const Data = mongoose.model(collectionName, dataSchema);

    return Data;
})();
