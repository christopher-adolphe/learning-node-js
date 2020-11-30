// Loading Express module
const express = require('express');
// Loading Mongoose module
const mongoose = require('mongoose');
// Loading the Genres module
const genresRouter = require('./routes/genres');

// Creating an Express application
const app = express();

// Connecting to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/vidly', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log('Connected to MongoDB'))
  .catch((exception) => console.error(`Sorry, could not connect to MongoDB: ${exception}`));

// Defining a port number for the Express application
const port = process.env.PORT || 3000;

// Adding Json middleware to convert request body into Json
app.use(express.json());

// Defining routes
app.use('/api/genres', genresRouter);

app.listen(port, () => {
  console.log(`Server is up and running on ${port}... Click here http://localhost:${port}`);
});
