const _ = require('lodash');
const navigationService = require('../services/navigationService');
const pageService = require('../services/pageService');


function getNavigation(sessionTemp, resolve, reject) {
    navigationService.getBySession(sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function getNavigationByProject(project, sessionTemp, resolve, reject) {

    navigationService.getByProject(project, sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function createNavigation(data, user, project) {
    const pageData = mergePageInfo(data);

    new Promise(createPage.bind(this, pageData)).then((page) => {
        navigationService.create({
            sessionTemp: data.data.sessionTemp,
            pages: page,
            project: project._id,
            user
        }, (err, navigation) => {});
    });
}

function createPage(data, resolve, reject) {
    pageService.create(data, (err, page) => {
        if (err) {
            reject(err);
        } else {
            resolve(page);
        }
    });
}

function mergePageInfo(data) {
    const pageInfo = data.data.page[0];
    const metaDatas = data.data.metaData;
    const actions = data.data.actions;
    const pageInfoCloned = Object.assign({}, pageInfo);

    pageInfoCloned.loadedOn = new Date().getTime();
    pageInfoCloned.pageToken = data.data.pageToken;

    if (!pageInfoCloned.metaData) {
        pageInfoCloned.metaData = [];
    }

    if (!pageInfoCloned.actions) {
        pageInfoCloned.actions = [];
    }

    for (const metadata in metaDatas) {
        pageInfoCloned.metaData.push(metaDatas[metadata]);
    }

    for (const action in actions) {
        pageInfoCloned.actions.push(actions[action]);
    }

    return pageInfoCloned;
}

function formatBooking(booking) {
    const bookingFormatted = {};
    _.forEach(booking, (bookingAttr) => {
       bookingFormatted[bookingAttr.key] = bookingAttr.value;
    });
    bookingFormatted.rooms = formatBookingRooms(bookingFormatted);
    return bookingFormatted;
}

function formatBookingRooms(booking) {
    if (typeof booking.rooms === 'string') {
        // this is the case when rooms data comes as an encoded JSON
        return JSON.parse(booking.rooms.replace(/&quot;/g,'"'));
    }
    return booking.rooms;
}

function updatePage(navigation, data) {
    const pageData = mergePageInfo(data);

    return new Promise(createPage.bind(this, pageData))
        .then(insertPage)
        .then(insertOrUpdateBooking)
        .then(saveNavigation);

    function insertPage(page) {
        return navigation.pages.push(page);
    }

    function insertOrUpdateBooking() {
        if (data.data.booking.length === 0) {
            return;
        }
        const booking = formatBooking(data.data.booking);
        if (bookingIsNotABonoVisit(booking)) {
            const index = navigation.bookings.findIndex(each => each.bookingCode === booking.bookingCode)
            if (index !== -1) {
                navigation.bookings[index] = booking;
            } else {
                navigation.bookings.push(booking);
            }
        }
    }

    function bookingIsNotABonoVisit(booking) {
        // Because booking data is set everytime the bono is visited,
        // we only want to count it as a booking
        // when it has the rooms or packs information
        return !!(booking.rooms || booking.packs);
    }

    function saveNavigation() {
        navigation.save();
    }

}

module.exports = {
    getNavigation,
    createNavigation,
    createPage,
    updatePage,
    getNavigationByProject
};
