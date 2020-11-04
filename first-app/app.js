// Main module: app.js

// Loading Node's built-in Path module
const path = require('path');
const pathObj = path.parse(__filename);

console.log('pathObj: ', pathObj);

// Loading Node's built-in OS module
const os = require('os');
const totalMemory = os.totalmem();
const freeMemory = os.freemem();

console.log(`OS total memory: ${totalMemory}`);
console.log(`OS free memory: ${freeMemory}`);
console.log(`OS used memory: ${totalMemory - freeMemory}`);

// Loading Node's built-in File System module
const fs = require('fs');

// Using file system readdirSync synchronous/blocking method to read files of current directory
const files = fs.readdirSync('./');

console.log(files);

// Using file system readdir asynchronous/non-blocking method to read files of current directory
const asyncFiles = fs.readdir('./', (error, files) => {
  if (error) {
    console.log(`Error: ${error}`)
  } else {
    console.log('Files: ', files);
  }
});

// Loading Node's built-in Events module
const EventEmitter = require('events');
// Creating an instance of the EventEmitter class
const emitter = new EventEmitter();

// Registering a listener for event
// !! Order is important. We should always register the listener of the event before it is emitted.
emitter.addListener('messageLogged', (eventArg) => {
  console.log('Event emitted', eventArg);
});

// Raising an event
emitter.emit('messageLogged', {id: 1, url: 'http://someurl.io'});

// Loading the logger.js module into the main module
const Logger = require('./logger');
const logger = new Logger();

// Registering a listener
logger.addListener('logging', (eventArg) => {
  console.log('Logging emitted: ', eventArg);
});
logger.log('This is node module system.');

// Loading Node's built-in Http module
const http = require('http');
// Creating a server
const server = http.createServer((request, response) => {
  if (request.url === '/') {
    response.write('Server is up and running...');
    response.end();
  }

  if (request.url === '/api/courses') {
    const result = [
      {title: 'Node.js - The Complete Guide', price: 12.99},
      {title: 'Angular - The Complete Guide', price: 15.99}
    ];

    response.write(JSON.stringify(result));
    response.end();
  }
});

// Registering a listener
// server.addListener('connection', (socket) => {
//   console.log('New connection...');
// });

server.listen(3000);
console.log(`Server listening on port 3000. Click here http://localhost:3000`);
