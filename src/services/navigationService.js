const navigationSchema = require('../models/navigationSchema');
const { mergePageInfo } = require('../helpers/page');
const pageService = require('../services/pageService');

async function create(args) {
    return await navigationSchema.create(args);
}

/**
 * Get all navigation
 *
 */
async function getAll(callback) {
    return await navigationSchema.find({})
        .populate(['pages', 'user'])
        .sort({ createAt: 1 })
}

function getBySession(sessionTemp, callback) {
    navigationSchema.findOne({ sessionTemp }, (err, page) => {
        if (err) {
            callback({ error: err }, null);
        } else {
            callback(null, page);
        }
    });
}

/**
 * Return a navigation page by a sessionTemp.
 * sessionTemp are create when user start a request and
 * this is deleted when user close the browser.
 *
 * @param {integer} projectID
 * @param {string} sessionTemp
 * @returns {object} Navigation schema
 */
async function getByProject(projectID, sessionTemp) {
    return await navigationSchema.findOne({ project: projectID, sessionTemp });
}

/**
 * Create a new navigation page
 *
 * @param {object} data
 * @param {object} user
 * @param {integer} projectID
 */
async function createNavigation(data, user, projectID) {
    const pageData = mergePageInfo(data);
    const page = await pageService.create(pageData);

    create({
        sessionTemp: data.data.sessionTemp,
        pages: page,
        project: projectID,
        user
    });
}

/**
 * Get pages created into a date range
 *
 * @param {object} dateFrom
 * @param {object} dateTo
 * @param {object} project
 */
async function getByCreate(dateFrom, dateTo, project) {
    const pages = await navigationSchema.find(
        {
            project,
            createAt: {
                $gte: dateFrom,
                $lte: dateTo
            }
        })
        .populate(['pages', 'user'])
        .sort({ createAt: 1 });

    return pages;
}

module.exports = {
    create,
    getAll,
    getBySession,
    getByProject,
    createNavigation,
    getByCreate
};
