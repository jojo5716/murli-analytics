const restify = require('restify');
const kue = require('kue');
const corsMiddleware = require('restify-cors-middleware')
const bodyParser = require('body-parser')

require('restify').plugins;

require('./handlerErrors');
require('./workers/listeners');
require('./prototypes');

const app = restify.createServer({ name: 'murli-api' });

const config = require('../config');

app.use(restify.plugins.acceptParser(app.acceptable));
app.use(restify.plugins.fullResponse());
app.use(bodyParser());
app.use(restify.plugins.queryParser());
app.use(restify.plugins.jsonp());

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['*']
})

app.pre(cors.preflight)
app.use(cors.actual)

app.listen(config.port, () => {
    console.log('server listening on port number', config.port);
});

// Kue dashboard to view all job list
kue.app.listen(3000);

const routes = require('./routes')(app);
