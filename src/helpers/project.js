const projectService = require('../services/projectService');


function getProject(projectID, resolve, reject) {
    projectService.getById(projectID, (err, project) => {
        if (err || !project) {
            reject(err);
        }
        resolve(project);
    });
}

module.exports = {
    getProject
};