module.exports = (function modelSchema() {
    const mongoose = require('../../database').mongoose;

    const objModelSchema = {
        devices: { type: Object, required: true },
        countries: { type: Object, required: true },
        metaData: { type: Object },
        actions: { type: Object, default: {} },
        previousUrl: { type: Object, required: true },
        users: { type: Object, required: true },
        visits: { type: Object, required: true },
        url: { type: String, required: true },
        availabilities: { type: Array, default: [] },
    };

    const collectionName = 'PageVisits';
    const objSchema = mongoose.Schema(objModelSchema);
    const objModel = mongoose.model(collectionName, objSchema);

    return objModel;
})();

