const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const authorize = require('../middleware/authorization');
const authorizeAdmin = require('../middleware/admin')

// Defining a route to handle http GET request to get all movies
router.get('/', async (resquest, response) => {
  try {
    const movieList = await Movie.find()
      .sort('title')

    response.send(movieList);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching movies: ${exception.message}`);
  }
});

// Defining a route to handle http GET request to get a specific movie
router.get('/:id', async (request, response) => {
  try {
    const selectedMovie = await Movie.findById(request.params.id);

    if (!selectedMovie) {
      return response.status(404).send(`Sorry, we could not find movie with id ${request.params.id}.`);
    }

    response.send(selectedMovie);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching movie with id ${request.params.id}: ${exception.message}`);
  }
});

// Defining a route to handle http POST request to add a new movie
router.post('/', authorize, async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not create new movie because ${error.message}.`);
  }

  try {
    const genre = await Genre.findById(request.body.genreId);

    if (!genre) {
      return response.status(400).send(`Sorry, we could not find genre with id ${request.body.genreId}.`);
    }

    const newMovie = new Movie({ ...request.body, genre: { _id: genre._id, name: genre.name } });

    await newMovie.save();

    response.status(201).send(newMovie);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while creating new movie: ${exception.message}`);
  }
});

// Defining a route to handle http PUT request to update a movie
router.put('/:id', authorize, async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not update movie with id ${request.params.id} because ${error.message}.`);
  }

  try {
    const genre = await Genre.findById(request.body.genreId);

    if (!genre) {
      return response.status(400).send(`Sorry, we could not find genre with id ${request.body.genreId} to perform update on movie.`);
    }

    const movie = await Movie.findByIdAndUpdate(request.params.id, { ...request.body, genre: { _id: genre._id, name: genre.name }}, { new: true });

    if (!movie) {
      return response.status(404).send(`Sorry, we could not find movie with id ${request.params.id} to perform update.`);
    }

    response.send(movie);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while updating movie with id ${request.params.id}: ${exception.message}`);
  }
});

// Defining a route to handle http DELETE request to delete a movie
router.delete('/:id', [authorize, authorizeAdmin], async (request, response) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(request.params.id);

    if (!deletedMovie) {
      return response.status(404).send(`Sorry, we could not find movie with id ${request.params.id} to perform delete.`);
    }

    response.send(deletedMovie);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while deleting movie with id ${request.params.id}: ${exception.message}`);
  }
});

module.exports = router;
