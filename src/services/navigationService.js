const navigationSchema = require('../models/navigationSchema');

const PAGE_SIZE = 100;


module.exports = {
    getAll,
    getAllByCreationDate,
    getBySession,
    getByProject,
    createNavigation,
    updateNavigationPage
};

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
async function getBySession(sessionTemp) {
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
 * @param {object} query
 *
 */
async function createNavigation(query) {
    return await navigationSchema.create({
        sessionTemp: query.sessionTemp,
        pages: query.page,
        project: query.project,
        user: query.user
    });
}

/**
 * Get pages created into a date range
 *
 * @param {object} dateFrom
 * @param {object} dateTo
 * @param {object} project
 */
async function getAllByCreationDate(dateFrom, dateTo, project, page = 1) {
    const query = {
        createAt: {
            $gte: dateFrom,
            $lte: dateTo
        }
    };

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

/**
 * Update pages and bookings from navigationPage
 *
 * @param {string} id Navigations
 * @param {array}  bookingsUpdated
 * @returns {array} pagesUpdated
 */
async function updateNavigationPage(id, bookingsUpdated, pagesUpdated) {
    return await navigationSchema.update({ '_id': id },
        {
            $set: {
                bookings: bookingsUpdated,
                pages:pagesUpdated
            }
        });
}
