const userController = require('./controllers/userController');
const projectController = require('./controllers/projectController');
const pageController = require('./controllers/pageController');
const analyticsController = require('./controllers/analyticsController');

module.exports = (app) => {
    app.get('/', (req, res) =>
        res.send('Hello World')
    );

    app.post('/project', projectController.createProject);
    app.post('/actions', pageController.saveAction);
    app.post('/track', pageController.trackPage);

    // API Rest
    app.get('/api/v1/users', userController.getAll);
    app.get('/api/v1/users/date/createAt/:dateFrom/:dateTo', userController.getAllByCreationDate);

    app.get('/api/v1/projects', projectController.getProjects);
    app.get('/api/v1/pages', pageController.getAll);
    app.get('/api/v1/navigations', pageController.getAllNavigations);
    app.get('/api/v1/pages/createAt/:dateFrom/:dateTo/:project', pageController.getAllByCreationDate);

    // Analytics
    app.post('/api/v1/analytics/new/report/:project', analyticsController.createReport);
    app.get('/api/v1/analytics/reports/:project', analyticsController.getReports);
    app.get('/api/v1/analytics/all/reports/', analyticsController.getAllReports);
};
