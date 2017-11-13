const restify = require('restify');
const kue = require('kue');

require('./workers/listeners');
require('./prototypes');

const config = require('../config');

// Kue dashboard to view all job list
kue.app.listen(3000);

const app = restify.createServer({ name: 'murli-api' });

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.use(restify.CORS({
    credentials: true
}));

app.listen(config.port, () => {
    console.log('server listening on port number', config.port);
});

const routes = require('./routes')(app);
