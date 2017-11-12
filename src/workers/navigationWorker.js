const { getTypeSeccionPage } = require('../helpers/page');


module.exports = {
    accumulateMetricsPageVisit
}

/**
 * When a user visit a page, we need to accumulate all data about
 * page, user, metaData, etc...
 * @param {object} pageData
 * @param {callback} done
 */
function accumulateMetricsPageVisit(pageData, done) {
    const pageInfo = pageData.data.page[0];
    const url = pageInfo.url;
    const pageType = getTypeSeccionPage(url);



    done();
}