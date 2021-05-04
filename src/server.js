const express = require('express');
const expressApp = express();
const path = require('path');
const http = require('http');
const httpLogger = require('./httpLogger');
const logger = require('./logger');
const port = process.env.PORT || 3100;

expressApp.use(express.static(path.join(__dirname, 'client', 'build')));
expressApp.use(httpLogger);
const server = http.createServer(expressApp);
server.listen(port, () => logger.info(`Radix Test is running on ${port}`));
