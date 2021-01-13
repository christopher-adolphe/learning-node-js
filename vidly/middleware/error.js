const winston = require('winston');

const errorHandler = (error, request, response, next) => {
  winston.error(error.message, error);
  response.status(500).send(`Sorry, something went wrong: ${error.message}`);
};

module.exports = errorHandler;
