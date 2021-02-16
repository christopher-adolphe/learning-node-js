// Loading Winston module
const winston = require('winston');
// Loading Express module
const express = require('express');
// Creating an Express application
const app = express();

// Loading the API Validation module
require('./startup/api-validation')();
// Loading the Config module
require('./startup/config')();
// Loading the Logging module
require('./startup/logging')();
// Loading the Routes module
require('./startup/routes')(app);
// Loading the Database module
require('./startup/db')();

// Defining a port number for the Express application
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  winston.info(`Server is up and running on ${port}... Click here http://localhost:${port}`);
});

module.exports = server;
