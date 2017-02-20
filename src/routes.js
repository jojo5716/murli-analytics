module.exports = function(app) {
    const dataController = require('./controllers/dataController');

    app.get('/', (req, res) =>
        res.send('Hello World')
    );

    app.post('/data', dataController.createData);
};
