// Loading Express Async Errors module
require('express-async-errors');
// Loading Winston module
const winston = require('winston');
// Loading Winston-mongodb module
// require('winston-mongodb');

module.exports = () => {
  // Handling and logging uncaughtException
  process.on('uncaughtException', (exception) => {
    winston.error(exception.message, exception);

    process.exit(1);
  });

  // Handling and logging unhandleRejection
  process.on('unhandledRejection', (exception) => {
    throw exception;
  });

  // Creating a Winston transport to log errors to a file
  // Creating a Winston transport to log errors to the database
  // winston.createLogger({
  //   transports: [
  //     new winston.transports.Console({ level: 'info', format: winston.format.colorize() }),
  //     new winston.transports.File({ filename: 'errors.log', level: 'error', format: winston.format.json() }),
  //     new winston.transports.MongoDB({ db: 'mongodb://127.0.0.1:27017/vidly' })
  //   ],
  //   exceptionHandlers: [
  //     new winston.transports.File({ filename: 'exceptions.log' })
  //   ]
  // });
}
