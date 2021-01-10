// Loading Config module
const config = require('config');
// Loading Express module
const express = require('express');
// Loading Mongoose module
const mongoose = require('mongoose');
// Loading Joi module
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
// Loading the Genres module
const genresRouter = require('./routes/genres');
// Loading the Customers module
const customersRouter = require('./routes/customers');
// Loading the Movies module
const moviesRouter = require('./routes/movies');
// Loading the Rentals module
const rentalsRouter = require('./routes/rentals');
// Loading the Users module
const usersRouter = require('./routes/users');
// Loading the Authentication module
const AuthenticationRouter = require('./routes/authentication');
// Loading the ErrorHandler module
const errorHanlder = require('./middleware/error');

// Creating an Express application
const app = express();

// Checking if JWT private key is defined and exiting the process
if (!config.get('jwtPrivateKey')) {
  console.error('Fatal error: jwtPrivateKey is not defined');

  process.exit(1);
}

// Connecting to MongoDB using Mongoose
const initConnection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/vidly', { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (exception) {
    console.error(`Sorry, could not connect to MongoDB: ${exception}`);
  }
};

initConnection();

// Defining a port number for the Express application
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server is up and running on ${port}... Click here http://localhost:${port}`);
});
