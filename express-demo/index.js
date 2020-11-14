// Loading the Express module
const express = require('express');
// Loading the Joi Module for schema validation
const Joi = require('joi');
// Loading custom Logger middleware
const logger =  require('./logger');
// Loading custom Authentication middleware
const authenticate = require('./authentication');
// Loading the Helmet module
const helmet = require('helmet');
// Loading the Morgan module 3rd party middleware
const morgan = require('morgan');

/**
 * Creating an Express application from the Express module.
 * 
 * The Express application exposes methods that corresponds
 * to http verbs (GET, POST, PUT, DELETE) that we can then
 * use to handle http requests to endpoints of our application.
 */
const app = express();

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
 * To set environment properties use:
 * export NODE_ENV=production
*/
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app env: ${app.get('env')}`);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
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

// Creating a list of courses
const courses = [
  {id: 1, title: 'Node.js - The Complete Guide', price: 12.99},
  {id: 2, title: 'Angular - The Complete Guide', price: 15.99},
  {id: 3, title: 'Vuejs - The Complete Guide', price: 13.99}
];

/**
 * Defining a route and it's handler.
 * 
 * Implementing a route handler for http GET requests for the root route.
 * @param {string} name - A string representing the url path (a.k.a The route)
 * @param {function} callback - A callback function which will handle the http GET request for the specified url (a.k.a The route handler)
*/
app.get('/', (request, response) => {
  response.send('Hello from Express!!');
});

/**
 * Defining a route handler for http GET request to get a list of courses.
 */
app.get('/api/courses', (request, response) => {
  response.send(courses);
});

/**
 * Defining a route with parameter
 * 
 * Passing the #id of a specific course as part of the url <:paramName> and obtainig it from the #request parameter of
 * the callback function as request.params.<paramName>
 * Query strings can alse be part of the url ?<queryName> and obtaining it from the #request parameter of the callback
 * function as request.query.<queryName>
*/
app.get('/api/courses/:id', (request, response) => {
  const selectedCourse = courses.find(course => course.id === +request.params.id);

  if (!selectedCourse) {
    return response.status(404).send(`No course found for id ${request.params.id}.`);
  }

  response.send(selectedCourse);
});

/**
 * Defining a route handler for http POST request to add new course.
 */
app.post('/api/courses', (request, response) => {
  const { error } = validateSchema(request.body);

  if (error) {
    return response.status(400).send(`Error: ${error.message}`);
  }

  const newCourse = {...request.body, id: courses.length + 1};

  courses.push(newCourse);

  response.status(201).send(newCourse);
});

/**
 * Defining a route handler for http PUT request to update a course
*/
app.put('/api/courses/:id', (request, response) => {
  const courseToBeUpdated = courses.find(course => course.id === +request.params.id);
  const { error } = validateSchema(request.body);

  // Handling invalid course id
  if (!courseToBeUpdated) {
    return response.status(404).send(`Could not find course with id ${request.params.id} to update.`);
  }

  // Handling invalid request body
  if (error) {
    return response.status(400).send(`Error: ${error.message}`);
  }

  // Updating the course corresponding to the #id passed as parameter
  const index = courses.findIndex(course => course.id === +request.params.id);
  courses[index] = {...request.body, id: +request.params.id};

  response.send({...request.body, id: +request.params.id});
});

/**
 * Defining a route handler for http DELETE request to delete a course
*/
app.delete('/api/courses/:id', (request, response) => {
  const index = courses.findIndex(course => course.id === +request.params.id);

  // Handling invalid course id
  if (index === -1) {
    return response.status(404).send(`Could not find course with id ${request.params.id} to delete.`);
  }

  // Deleting the course corresponding to the #id passsed as parameter
  courses.splice(index, 1);

  response.send(`Course with id ${request.params.id} was successfully deleted.`);
});

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
