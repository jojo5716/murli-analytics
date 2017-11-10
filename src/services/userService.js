const userSchema = require('../models/userSchema');
const { parseUserInfo } = require('../helpers/user');


module.exports = {
    create,
    getAll,
    getBySession,
    getByCreate,
    getUserOrCreate
};


/**
 * Create new user
 *
 * @param {any} data
 * @param {any} callback
 */
async function create(data) {
    return await userSchema.create(data);
}

/**
 * Getting all users
 *
 */
async function getAll() {
    return await userSchema.find({});
}

/**
 * Get a unique user by session id.
 * When a user visit any page, a session token is created to
 * identify the user on each request.
 * @param {string} session
 * @param {any} callback
 */
async function getBySession(session) {
    return await userSchema.findOne({ session });
}

/**
 * Get users by a created date
 * To know all new users into a date range
 *
 * @param {any} dateFrom
 * @param {any} dateTo
 */
async function getByCreate(dateFrom, dateTo) {
    return await userSchema.find({ createAt: { $gte: dateFrom, $lte: dateTo } });
}


/**
 * Get user or create if not exist.
 * If the user does not exist, we need to create it, with
 * all information about enviroment, session id, and userInfo data.
 * @param {any} data
 * @returns {object} User
 */
async function getUserOrCreate(data) {
    const userSessionID = data.data.session;

    let user = await getBySession(userSessionID);

    if (!user) {
        const userInfo = {
            dataUser: data.data.enviroment[0],
            session: userSessionID
        };

        const extraData = parseUserInfo(data.data.userInfo);
        const mergedInfo = Object.assign(userInfo, extraData);

        user = await create(mergedInfo);
    }

    return user;
}
