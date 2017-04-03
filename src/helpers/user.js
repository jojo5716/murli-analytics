const _ = require('lodash');
const userService = require('../services/userService');

function mergeUserInfo(userInfo) {
    const info = {};

    for (const key in userInfo) {
        const userData = userInfo[key];
        info[userData.key] = userData.value;
    }
    return info;
}

function getCodeFromBookin(bookingInfo) {
    let bookingCode = null;

    _.forEach(bookingInfo, (booking) => {
       if (booking.key === 'bookingCode') {
           bookingCode = booking.value;
       }
    });

    return bookingCode;
}

function isBookingExist(bookings, bookingCode) {
    let bookingExist = false;

    _.forEach(bookings, (booking) => {
        if (booking.bookingCode === bookingCode) {
            bookingExist = true;
        }
    });

    return bookingExist;
}

function getUserOrCreate(data, resolve, reject) {
    userService.getBySession(data.data.session, (err, user) => {
        if (err) reject(err);

        if (user) {
            resolve(user);
        } else {
            const userInfo = {
                dataUser: data.data.enviroment[0],
                session: data.data.session
            };
            const extraData = mergeUserInfo(data.data.userInfo);
            const mergedInfo = Object.assign(userInfo, extraData);

            userService.create(mergedInfo, (error, user) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        }
    });
}

module.exports = {
    getUserOrCreate
};
