const userService = require('../services/userService');

function mergeUserInfo(userInfo) {
    const info = {};

    for (const key in userInfo) {
        const userData = userInfo[key];
        info[userData.key] = userData.value;
    }
    return info;
}

function updateUserInfo(user, bookingInfo) {
    const booking = {};

    if (bookingInfo.length > 0) {
        for (const key in bookingInfo) {
            const bookingData = bookingInfo[key];
            booking[bookingData.key] = bookingData.value;
        }
        user.bookings.push(booking);
        user.save(() => {});
    }
}

function getUserOrCreate(data, resolve, reject) {
    userService.getBySession(data.data.session, (err, user) => {
        if (err) reject(err);

        if (user) {
            updateUserInfo(user, data.data.booking);
            resolve(user);
        } else {
            updateUserInfo(user, data.data.booking);
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
