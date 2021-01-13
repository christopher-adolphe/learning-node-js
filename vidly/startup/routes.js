const express = require('express');
// Loading the Genres module
const genresRouter = require('../routes/genres');
// Loading the Customers module
const customersRouter = require('../routes/customers');
// Loading the Movies module
const moviesRouter = require('../routes/movies');
// Loading the Rentals module
const rentalsRouter = require('../routes/rentals');
// Loading the Users module
const usersRouter = require('../routes/users');
// Loading the Authentication module
const AuthenticationRouter = require('../routes/authentication');
// Loading the ErrorHandler module
const errorHanlder = require('../middleware/error');

module.exports = (app) => {
  // Adding Json middleware to convert request body into Json
  app.use(express.json());

  // Defining routes
  app.use('/api/genres', genresRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', rentalsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/auth', AuthenticationRouter);

  // Adding an error middleware function
  app.use(errorHanlder);
}
