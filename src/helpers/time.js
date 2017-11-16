const moment = require('moment');


module.exports = {
    getTodayHumanDate,
    getCurrentMonth,
    getCurrentYear
};

/**
 * Return the current date in a "YYYY-MM-DD" format
 *
 * @returns {string} Current date
 */
function getTodayHumanDate() {
    return moment().format('YYYY-MM-DD');
}

function getCurrentMonth() {
    return moment().format('MM');
}


function getCurrentYear() {
    return moment().format('YYYY');
}