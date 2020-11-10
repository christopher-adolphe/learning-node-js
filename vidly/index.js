// Loading Express module
const express = require('express');
// Loading Joi module
const Joi = require('joi');

// Creating an Express application
const app = express();

// Defining a port number for the Express application
const port = process.env.PORT || 3000;

// Adding Json middleware to convert request body into Json
app.use(express.json());

// Defining a validator function for genre schema
const genreValidator = (genre) => {
  // Defining the schema constraints using Joi
  const genreSchema = Joi.object({
    name: Joi.string().required()
  });

  return genreSchema.validate(genre);
};

// Defining a list of movie genres
const genreList = [
  {id: 1, name: 'Action & Adventure'},
  {id: 2, name: 'Anime'},
  {id: 3, name: 'Classic'},
  {id: 4, name: 'Comedy'},
  {id: 5, name: 'Drama'},
  {id: 6, name: 'Documentary'},
  {id: 7, name: 'Horror'},
  {id: 8, name: 'Romantic'},
  {id: 9, name: 'Sci-fi & Fantasy'},
  {id: 10, name: 'Sports'},
  {id: 11, name: 'Teen'},
  {id: 12, name: 'Thriller'},
  {id: 13, name: 'Sci-fi & Fantasy'}
];

// Defining the root route of the application
app.get('/', (request, response) => {
  response.send('Vidly App running...');
});

// Defining a route to handle http GET request to get all genres
app.get('/api/genres', (request, response) => {
  response.send(genreList);
});

// Defining a route to handle http GET request to get a specific genre
app.get('/api/genres/:id', (request, response) => {
  const selectedGenre = genreList.find(genre => genre.id === +request.params.id);

  if (!selectedGenre) {
    return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id}.`);
  }

  response.send(selectedGenre);
});

// Defining a route to handle http POST request to add new genre
app.post('/api/genres', (request, response) => {
  const {error} = genreValidator(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not add new genre because ${error.message}.`);
  }

  const newGenre = {...request.body, id: genreList.length + 1};

  genreList.push(newGenre);

  response.status(201).send(newGenre);
});

// Defining a route to handle http PUT request to update a genre
app.put('/api/genres/:id', (request, response) => {
  const index = genreList.findIndex(genre => genre.id === +request.params.id);
  const {error} = genreValidator(request.body);

  if (index === -1) {
    return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id} to perform update.`);
  }

  if (error) {
    return response.sendStatus(400).send(`Sorry, we could not update genre with id ${request.params.id} because ${error.message}.`);
  }

  genreList[index] = {...request.body, id: +request.params.id};

  response.send({...request.body, id: +request.params.id})
});

// Defining a route to handle http DELETE request to delete a genre
app.delete('/api/genres/:id', (request, response) => {
  const index = genreList.findIndex(genre => genre.id === +request.params.id);

  if (index === -1) {
    return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id} to perform delete.`);
  }

  const deletedGenre = genreList[index];

  genreList.splice(index, 1);

  response.send(deletedGenre);
});

app.listen(port, () => {
  console.log(`Server is up and running on ${port}... Click here http://localhost:${port}`);
});
