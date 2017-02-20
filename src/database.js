const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.dbPath);
const db = mongoose.connection;

db.on('error', () => {
    console.log('Error on database');
});

db.on('open', () => {
    console.log('Successfully opened db');
});

exports.mongoose = mongoose;