const appVersion = "7.0"

const express = require('express');
const expressApp = express();
const path = require('path');
const http = require('http');
const httpLogger = require('./httpLogger');
const logger = require('./logger');
const api = require('./api')(appVersion);
const port = process.env.PORT || 3100;

expressApp.use(httpLogger);
expressApp.use('/api', api);
expressApp.use(express.static(path.join(__dirname, 'static')));
const server = http.createServer(expressApp);
server.listen(port, () => logger.info(`Radix Test is running on ${port}`));
