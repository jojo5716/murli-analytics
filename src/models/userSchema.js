module.exports = (function userSchema() {
    const mongoose = require('../database').mongoose;

    const userModel = {
        session: { type: String, required: true },
        ip: { type: String, required: false },
        country: { type: String, required: false },
        zip: { type: String, required: false },
        latitude: { type: String, required: false },
        longitude: { type: String, required: false },
        lang: { type: String, required: false },
        dataUser: { type: Object },
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'User';
    const userSchema = mongoose.Schema(userModel);
    const User = mongoose.model(collectionName, userSchema);

    return User;
})();
