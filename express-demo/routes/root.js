const express = require('express');
const router = express.Router();

/**
 * Defining a route and it's handler.
 * 
 * Implementing a route handler for http GET requests for the root route.
 * @param {string} name - A string representing the url path (a.k.a The route)
 * @param {function} callback - A callback function which will handle the http GET request for the specified url (a.k.a The route handler)
*/
router.get('/', (request, response) => {
  // response.send('Hello from Express!!');
  response.render('index', {title: 'Express Demo App', message: 'Hello from Express!!'})
});

module.exports = router;
