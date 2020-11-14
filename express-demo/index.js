// Loading the Express module
const express = require('express');
// Loading the Root module
const rootRouter = require('./routes/root');
// Loading the Courses module
const coursesRouter = require('./routes/courses');
// Loading the Joi Module for schema validation
const Joi = require('joi');
// Loading custom Logger middleware
const logger =  require('./middleware/logger');
// Loading custom Authentication middleware
const authenticate = require('./authentication');
// Loading the Helmet module
const helmet = require('helmet');
// Loading the Morgan module 3rd party middleware
const morgan = require('morgan');
// Loading the Config module
const config = require('config');
/**
 * Loading the Debug module
 * 
 * Creating various debugging namespace to use throughout the Express application
*/
const startupDebugger = require('debug')('app:startup');
const databaseDebugger = require('debug')('app:database');

/**
 * Creating an Express application from the Express module.
 * 
 * The Express application exposes methods that corresponds
 * to http verbs (GET, POST, PUT, DELETE) that we can then
 * use to handle http requests to endpoints of our application.
 */
const app = express();

/**
 * Defining the router to use for root endpoint
 */
app.use('/', rootRouter);

/**
 * Defining the router to use for courses endpoint
 */
app.use('/api/courses', coursesRouter);

/**
 * Setting a Pug as view engine for dynamic templating
 */
app.set('view engine', 'pug');

/**
 * Adding JSON middleware to the Express application.
 * 
 * The express.json function is a built-in middleware function
 * which parses incoming request with json payload and returns
 * an object.
*/
app.use(express.json());

/**
 * Adding Urlencoded middleware to the Express application.
 * 
 * The express.urlencoded function is a built-in middleware function
 * which parses incoming request with urlencoded payload.
*/
app.use(express.urlencoded({extended: true}));

/**
 * Adding Static middlware to the Express application.
 * 
 * The express.static function is a built-in middleware function
 * which the Express application serve static file to the client.
 * @param {string} root - A string representing the directory to take as root for serving static files.
*/
app.use(express.static('public'));

/**
 * Adding Helmet 3rd party middleware to the Express application.
 * 
 * Helmet helps securing the Express application by setting various http headers.
*/
app.use(helmet());

/**
 * Adding Morgan 3rd party middleware to the Express application.
 * 
 * Morgan is an HTTP request logger for Node.js. Also adding an environment
 * check to use Morgan in development environment only.
 * 
 * Two ways of obtaining environment based information are:
 * 1) process.env.NODE_ENV
 * 2) app env: ${app.get('env')
 * 
 * To set environment variables use:
 * export NODE_ENV=production
*/
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app env: ${app.get('env')}`);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  startupDebugger('Morgan enabled');
}

// Using the databaseDebugger
databaseDebugger('Connected to database');

/**
 * Using Config to get configuration details from different environments
*/
console.log(`Application name: ${config.get('name')}`);
if (config.has('mail')) {
  console.log(`Mail server host: ${config.get('mail.host')}`);
  // console.log(`Mail server password: ${config.get('mail.password')}`);
}

/**
 * Creating a custom middleware function to log every request.
*/
app.use(logger);

/**
 * Creating a custom middleware function to authenticate every request.
*/
app.use(authenticate);

// Defining the contraints of course schema
const validateSchema = (course) => {
  const courseSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required()
  });

  return courseSchema.validate(course);
};

/***
 * Creating a listener for a network port.
 * 
 * @param {number} port - The network port number
 * @param {function?} callback - A callback funchtion which will be called when the Express application will start listening to the port
*/

/**
 * Retrieving the port number from environment variables.
 * 
 * To assign an environment variable on macOS use this command in Terminal: export PORT=5000
 * To assign an environment variable on Windows use this command in Command Prompt: set PORT=5000
*/
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}. Click here http://localhost:${port}`);
});
