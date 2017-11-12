const pageSchema = require('../models/pageSchema');
const navigationSchema = require('../models/navigationSchema');
const { mergePageInfo, formatBooking } = require('../helpers/page');

module.exports = {
    create,
    getAll,
    getByToken,
    updatePage
};

/**
 * Create a new page
 *
 * @param {any} args
 * @returns {object} Page
 */
async function create(args) {
    return await pageSchema.create(args);
}

/**
 * Getting all pages from db
 *
 * @return {array} Pages
 */
async function getAll() {
    return await pageSchema.find({});
}
/**
 * Get page by token
 *
 * @param {any} pageToken
 */
async function getByToken(pageToken) {
    return await pageSchema.findOne({ pageToken });
}

/**
 * Update page model to add a new visit page into a Navigation model.
 *  When a user visit a page, that is saved into a navigation model.
 * @param {object} navigation Navigation object
 * @param {any} data
 * @returns
 */
async function updatePage(navigation, data) {
    const pageData = mergePageInfo(data);
    const newPage = await create(pageData);

    // Pushing the new page into navigation
    navigation.pages.push(newPage);

    insertOrUpdateBooking(navigation, data.data.booking);

    navigation.save();

}

/**
 * If the new page visited has a new booking we need to add it
 * into a navigation object
 *
 * @param {object} navigation
 * @param {any} booking
 */
function insertOrUpdateBooking(navigation, booking) {
    if (booking.length !== 0) {
        const booking = formatBooking(booking);

        if (bookingIsNotABonoVisit(booking)) {
            const index = navigation.bookings.findIndex(each => each.bookingCode === booking.bookingCode);

            if (index !== -1) {
                navigation.bookings[index] = booking;
            } else {
                navigation.bookings.push(booking);
            }
        }
    }
}

function bookingIsNotABonoVisit(booking) {
    // Because booking data is set everytime the bono is visited,
    // we only want to count it as a booking
    // when it has the rooms or packs information
    return !!(booking.rooms || booking.packs);
}
