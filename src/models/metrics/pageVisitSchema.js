module.exports = (function modelSchema() {
    const mongoose = require('../../database').mongoose;

    const objModelSchema = {
        devices: { type: Object, required: true },
        countries: { type: Object, required: true },
        metaData: { type: Object },
        previousUrl: { type: Array, default: [] },
        atHours: { type: Array, default: [] },
        users: { type: Array, default: [] },
        visits: { type: Number, default: 1 },
        url: { type: String, required: true }
    };

    const collectionName = 'PageVisits';
    const objSchema = mongoose.Schema(objModelSchema);
    const objModel = mongoose.model(collectionName, objSchema);

    return objModel;
})();
