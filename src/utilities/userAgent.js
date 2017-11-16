
const UAParser = require('ua-parser-js');

const parser = new UAParser();


module.exports = {
    getUserAgentInfo,
    userAgentDeviceInfo
};


/**
 * Get information about user agent
 * Return an object with os name, version, browser info, etc..
 * @param {string} userAgent
 * @returns {object} User name data
 */
function getUserAgentInfo(userAgent) {
    return parser.setUA(userAgent).getResult()
}

/**
 * Return an object with a basic user agent data
 *
 * @param {object} userAgentInfo
 * @returns {object} User agent basic data
 */
function userAgentDeviceInfo(userAgentInfo) {
    return {
        deviceModel: userAgentInfo.device.model,
        deviceName: userAgentInfo.device.vendor,

        browserName: userAgentInfo.browser.name,
        browserVersion: userAgentInfo.browser.version.replaceAll('.', '#'),

        osName: userAgentInfo.os.name,
        osVersion: userAgentInfo.os.version.replace('.', '#')
    };
}