// Loading the Express module
const express = require('express');

/**
 * Creating a router object to manage routes related to courses.
 */
const router = express.Router();

// Creating a list of courses
const courses = [
  {id: 1, title: 'Node.js - The Complete Guide', price: 12.99},
  {id: 2, title: 'Angular - The Complete Guide', price: 15.99},
  {id: 3, title: 'Vuejs - The Complete Guide', price: 13.99}
];

/**
 * Defining a route handler for http GET request to get a list of courses.
 */
router.get('/', (request, response) => {
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
router.get('//:id', (request, response) => {
  const selectedCourse = courses.find(course => course.id === +request.params.id);

  if (!selectedCourse) {
    return response.status(404).send(`No course found for id ${request.params.id}.`);
  }

  response.send(selectedCourse);
});

/**
 * Defining a route handler for http POST request to add new course.
 */
router.post('/', (request, response) => {
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
router.put('/:id', (request, response) => {
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
router.delete('/:id', (request, response) => {
  const index = courses.findIndex(course => course.id === +request.params.id);

  // Handling invalid course id
  if (index === -1) {
    return response.status(404).send(`Could not find course with id ${request.params.id} to delete.`);
  }

  // Deleting the course corresponding to the #id passsed as parameter
  courses.splice(index, 1);

  response.send(`Course with id ${request.params.id} was successfully deleted.`);
});

module.exports = router;
