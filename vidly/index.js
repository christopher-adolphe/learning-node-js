// Loading Express module
const express = require('express');
// Loading the Root module
const rootRouter = require('./routes/root');
// Loading the Genres module
const genresRouter = require('./routes/genres');

// Creating an Express application
const app = express();

// Defining a port number for the Express application
const port = process.env.PORT || 3000;

// Adding Json middleware to convert request body into Json
app.use(express.json());

// Defining routes
app.use('/', rootRouter);
app.use('/api/genres', genresRouter);

app.listen(port, () => {
  console.log(`Server is up and running on ${port}... Click here http://localhost:${port}`);
});
