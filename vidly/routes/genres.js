const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

// Defining a route to handle http GET request to get all genres
router.get('/', async (request, response) => {
  try {
    const genreList = await Genre.find()
      .sort('name')
      .select('_id name');

    response.send(genreList);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching genres: ${exception.message}`);
  }
});

// Defining a route to handle http GET request to get a specific genre
router.get('/:id', async (request, response) => {
  try {
    const selectedGenre = await Genre.findById(request.params.id);

    if (!selectedGenre) {
      return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id}.`);
    }

    response.send(selectedGenre);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching genre with id ${request.params.id}: ${exception.message}`);
  }
});

// Defining a route to handle http POST request to add a new genre
router.post('/', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not add new genre because ${error.message}.`);
  }

  try {
    const newGenre = new Genre({ name: request.body.name });

    await newGenre.save();
    
    response.status(201).send(newGenre);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while creating new genre: ${exception.message}`);
  }
});

// Defining a route to handle http PUT request to update a genre
router.put('/:id', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.sendStatus(400).send(`Sorry, we could not update genre with id ${request.params.id} because ${error.message}.`);
  }
  
  try {
    const genre = await Genre.findByIdAndUpdate(request.params.id, { name: request.body.name }, { new: true });
    
    if (!genre) {
      return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id} to perform update.`);
    }

    genre.set({
      name: request.body.name
    });

    const result = await genre.save();

    response.send(result);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while updating genre with id ${request.params.id}: ${exception.message}`);
  }
});

// Defining a route to handle http DELETE request to delete a genre
router.delete('/:id', async (request, response) => {
  try {
    const deletedGenre = await Genre.findByIdAndRemove(request.params.id);

    if (!deletedGenre) {
      return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id} to perform delete.`);
    }

    response.send(deletedGenre);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while deleting genre with id ${request.params.id}: ${exception.message}`);
  }
});

module.exports = router;
