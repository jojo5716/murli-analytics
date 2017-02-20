const restify = require('restify');
const config = require('../config');

const app = restify.createServer({ name: 'murli-api' });

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.listen(config.port, () => {
    console.log('server listening on port number', config.port);

});

const routes = require('./routes')(app);
