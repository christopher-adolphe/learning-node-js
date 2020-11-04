// Module: logger.js
const EventEmitter = require('events');
const url = 'http://mylogger.io/log';

// Creating a Logger class which extends EventEmitter class
class Logger extends EventEmitter {
  log(message) {
    console.log(message);
    
    this.emit('logging', {data: message})
  }
}

// Using module.exports to make the Logger class accessible outside the logger.js module
module.exports = Logger;
