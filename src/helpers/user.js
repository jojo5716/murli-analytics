const _ = require('lodash');


module.exports = {
    parseUserInfo,
    getCodeFromBookin,
    isBookingExist
};


/**
 * Get an object with all user info data
 *
 * @param {array} userInfo Array where each item has a key and value property
 * @returns {object} user info parsed
 */
function parseUserInfo(userInfo) {
    const info = {};

    for (const key in userInfo) {
        const userData = userInfo[key];

        info[userData.key] = userData.value;
    }

    return info;
}

/**
 * Get code from booking object
 *
 * @param {object} bookingInfo
 * @returns {string} Booking code
 */
function getCodeFromBookin(bookingInfo) {
    let bookingCode = null;

    _.forEach(bookingInfo, (booking) => {
        if (booking.key === 'bookingCode') {
            bookingCode = booking.value;
        }
    });

    return bookingCode;
}

/**
 * Return a boolean if the booking exist
 *
 * @param {array} bookings
 * @param {string} bookingCode
 * @returns {boolean} Booking exist
 */
function isBookingExist(bookings, bookingCode) {
    let bookingExist = false;

    _.forEach(bookings, (booking) => {
        if (booking.bookingCode === bookingCode) {
            bookingExist = true;
        }
    });

    return bookingExist;
}
