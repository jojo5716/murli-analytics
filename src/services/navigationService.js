const navigationSchema = require('../models/navigationSchema');
const { mergePageInfo } = require('../helpers/page');
const pageService = require('../services/pageService');

/**
 * Create new navigation
 *
 * @param {object} args
 * @returns {object} Navigation
 */
async function create(args) {
    return await navigationSchema.create(args);
}

/**
 * Get all navigation
 *
 */
async function getAll(page) {
    return await navigationSchema
        .find()
        .populate(['pages', 'user'])
        .skip(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE);
}
/**
 * Get navigation by session token
 *
 * @param {string} sessionTemp
 */
async function getBySession(sessionTemp, callback) {
    return await navigationSchema.findOne({ sessionTemp });
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
async function getAllByCreationDate(dateFrom, dateTo, project) {
    const query = {
        createAt: {
            $gte: dateFrom,
            $lte: dateTo
        }
    }

    if (project) {
        query.project = project;
    }

    const navigations = await navigationSchema
        .find(query)
        .populate(['pages', 'user'])
        .skip(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE)
        .sort({ createAt: 1 });

    return navigations;
}

module.exports = {
    create,
    getAll,
    getAllByCreationDate,
    getBySession,
    getByProject,
    createNavigation,
    getAllByCreationDate
};
