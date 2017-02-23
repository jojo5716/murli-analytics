module.exports = function(app) {
    const userController = require('./controllers/userController');
    const projectController = require('./controllers/projectController');

    app.get('/', (req, res) =>
        res.send('Hello World')
    );

    app.post('/data', userController.createUser);
    app.get('/data', userController.getAllData);

    app.post('/project', projectController.createProject);
    app.get('/projects', projectController.getProjects);
};
