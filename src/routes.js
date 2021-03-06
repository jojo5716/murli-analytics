const userController = require('./controllers/userController');
const projectController = require('./controllers/projectController');
const pageController = require('./controllers/pageController');
const navigationController = require('./controllers/navigationController');
const analyticsController = require('./controllers/analyticsController');

module.exports = (app) => {
    app.post('/project', projectController.createProject);
    app.post('/actions', pageController.saveAction);
    app.post('/track', pageController.trackPage);
    app.get('/delete-jobs', pageController.deleteAllJobs);
    app.get('/resume-active-jobs', pageController.resumeActiveJobs);
    app.get('/resume-inactive-jobs', pageController.resumeInactiveJobs);

    // API Rest

    // User views
    app.get('/api/v1/users', userController.getAll);
    app.get('/api/v1/users/date/createAt/:dateFrom/:dateTo', userController.getAllByCreationDate);

    // Project views
    app.get('/api/v1/projects', projectController.getProjects);

    // Pages views
    app.get('/api/v1/pages', pageController.getAll);

    // Navigation views
    app.get('/api/v1/navigations', navigationController.getAll);
    app.get('/api/v1/navigations/createAt/:dateFrom/:dateTo', navigationController.getAllByCreationDate);
    app.get('/api/v1/navigations/createAt/:dateFrom/:dateTo/:project', navigationController.getAllByCreationDate);
    app.get('/api/v1/navigations/createAt/:dateFrom/:dateTo/:project/:page', navigationController.getAllByCreationDate);

    // Analytics views
    app.post('/api/v1/analytics/new/report/:project', analyticsController.createReport);
    app.get('/api/v1/analytics/reports/:project', analyticsController.getReports);
    app.get('/api/v1/analytics/all/reports/', analyticsController.getAllReports);
};
