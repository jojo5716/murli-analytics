module.exports = function(app) {
    const dataController = require('./controllers/dataController');
    const projectController = require('./controllers/projectController');

    app.get('/', (req, res) =>
        res.send('Hello World')
    );

    app.post('/data', dataController.createData);
    app.get('/data', dataController.getAllData);

    app.post('/project', projectController.createProject);
    app.get('/projects', projectController.getProjects);
};
