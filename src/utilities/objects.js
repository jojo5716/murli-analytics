const lodash = require('lodash');


module.exports = {
    getValueFromNestedObject,
    createNestedObject
};


/**
 * Getting value from a nested object
 *
 * @param {object} obj
 * @param {array|string} path
 * @param {any} defaultValue
 * @return {object}
 */
function getValueFromNestedObject(obj, path, defaultValue) {
    return lodash.get(obj, path, defaultValue);
}

/**
 * Create a nested object dynamically
 * From and object, we need to pass an array|string to create a nested object
 * Example: getValueFromNestedObject({}, ['a', 'b', 'c'], 1);
 *          Output: {a: b: c: 1}
 *
 * @param {object} obj
 * @param {array|string} path
 * @param {any} defaultValue
 * @return {object}
 */
function createNestedObject(obj, keys, value) {
    return lodash.set(obj, keys, value);
}
