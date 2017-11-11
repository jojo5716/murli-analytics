const _ = require('lodash');

module.exports = {
    mergePageInfo,
    formatBooking
};

/**
 * Create a copy of data object and parse it to get a simple object
 *
 * @param {object} data
 * @returns {object} Data copy parse
 */
function mergePageInfo(data) {
    // Getting url and previous url for the page visited
    const pageInfo = data.data.page[0];

    const metaDatas = data.data.metaData;
    const actions = data.data.actions;
    const pageInfoCloned = Object.assign({}, pageInfo);

    pageInfoCloned.loadedOn = new Date().getTime();
    pageInfoCloned.pageToken = data.data.pageToken;

    initializeAttr(pageInfoCloned, 'metaData', []);
    initializeAttr(pageInfoCloned, 'actions', []);

    for (const metadata in metaDatas) {
        pageInfoCloned.metaData.push(metaDatas[metadata]);
    }

    for (const action in actions) {
        pageInfoCloned.actions.push(actions[action]);
    }

    return pageInfoCloned;
}

/**
 * To inicialize all actions, metadata for a navigation.
 *
 * @param {object} obj
 * @param {string} attributeName
 * @param {any} defaultValue
 */
function initializeAttr(obj, attributeName, defaultValue) {
    if (!obj[attributeName]) {
        obj[attributeName] = defaultValue;
    }
}

/**
 * Format a booking object
 *
 * @param {array} booking Array of object with booking data
 * @returns {object} Booking
 */
function formatBooking(booking) {
    const bookingFormatted = {};

    _.forEach(booking, (bookingAttr) => {
       bookingFormatted[bookingAttr.key] = bookingAttr.value;
    });

    bookingFormatted.rooms = formatBookingRooms(bookingFormatted);

    return bookingFormatted;
}

/**
 * Format a booking rooms
 *
 * @param {object} booking
 * @returns {object} Rooms
 */
function formatBookingRooms(booking) {
    if (typeof booking.rooms === 'string') {
        // this is the case when rooms data comes as an encoded JSON
        return JSON.parse(booking.rooms.replace(/&quot;/g,'"'));
    }

    return booking.rooms;
}
