// Module: logger.js

const url = 'http://mylogger.io/log';

const log = (message) => {
  // Send an http request
  console.log(message);
}

// Using module.exports to make the log() accessible outside the logger.js module
module.exports = log;
