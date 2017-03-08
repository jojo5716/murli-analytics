module.exports = function(app) {
    const userController = require('./controllers/userController');
    const projectController = require('./controllers/projectController');
    const pageController = require('./controllers/pageController');

    app.get('/', (req, res) =>
        res.send('Hello World')
    );

    app.get('/users', userController.getAll);

    app.get('/projects', projectController.getProjects);
    app.post('/project', projectController.createProject);

    app.get('/pages', pageController.getAll);
    app.post('/actions', pageController.saveAction);
    app.post('/track', pageController.trackPage);

};
