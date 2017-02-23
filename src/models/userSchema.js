module.exports = (function userSchema() {
    const mongoose = require('../database').mongoose;

    const userModel = {
        session: { type: String, required: true },
        dataUser: { type: Object },
        createAt: { type: Date, default: Date.now }
    };

    const collectionName = 'User';
    const userSchema = mongoose.Schema(userModel);
    const User = mongoose.model(collectionName, userSchema);

    return User;
})();
