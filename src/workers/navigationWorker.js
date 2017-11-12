const pageMetricSchema = require('../models/metrics/pageMetricSchema');
const navigationWorkerService = require('../services/workers/navigationWorkerService');
const projectService = require('../services/projectService');
const { getTypeSeccionPage, getUrlFromPageData } = require('../helpers/page');
const {
    getAtHourVisit,
    generateBasicMetricPageSchema,
    updateMetricPageContent
 } = require('../helpers/workers/page');

module.exports = {
    accumulateMetricsPageVisit
}


/**
 * When a user visit a page, we need to accumulate all data about
 * page, user, metaData, etc...
 * @param {object} pageData
 * @param {callback} done
 */
async function accumulateMetricsPageVisit(pageData, done) {
    console.log(pageData);

    const url = getUrlFromPageData(pageData);
    const project = pageData.project;

    // Get page type (content, availability, no-availability...)
    const pageType = getTypeSeccionPage(url);

    const metric = await navigationWorkerService.findMetricRowByType(project, pageType);

    if (!metric) {
        const metricPage = generateBasicMetricPageSchema(url);

        const metricObj = {
            project,
            type: pageType,
            pages: [updateMetricPageContent(metricPage, pageData)]
        };

        console.log(metricObj);

        navigationWorkerService.create(metricObj);
    } else {
        // TODO: Filtrar todas las paginas de la metrica para actualizar la pagina
        // que estamos visitando.

        /*  metric.pages.push(
             updateMetricPageContent(metricPage, pageData)
         );
 
         metric.save(); */
    }

    done();
}