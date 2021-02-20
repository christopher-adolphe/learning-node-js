const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const authorize = require('../middleware/authorization');
const authorizeAdmin = require('../middleware/admin');

router.get('/', async (request, response) => {
  const genreList = await Genre.find()
    .sort('name')
    .select('_id name');

  response.send(genreList);
});

// Defining a route to handle http GET request to get a specific genre
router.get('/:id', async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(404).send(`Sorry, we could not find genre because id ${request.params.id} is invalid.`)
  }
  
  const selectedGenre = await Genre.findById(request.params.id);

  if (!selectedGenre) {
    return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id}.`);
  }

  response.send(selectedGenre);
});

// Defining a route to handle http POST request to add a new genre
router.post('/', authorize, async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not create new genre because ${error.message}.`);
  }

  const newGenre = new Genre({ name: request.body.name });

  await newGenre.save();
  
  response.status(201).send(newGenre);
});

// Defining a route to handle http PUT request to update a genre
router.put('/:id', authorize, async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.sendStatus(400).send(`Sorry, we could not update genre with id ${request.params.id} because ${error.message}.`);
  }
  
  const genre = await Genre.findByIdAndUpdate(request.params.id, { name: request.body.name }, { new: true });
    
  if (!genre) {
    return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id} to perform update.`);
  }

  response.send(genre);
});

// Defining a route to handle http DELETE request to delete a genre
router.delete('/:id', [authorize, authorizeAdmin], async (request, response) => {
  const deletedGenre = await Genre.findByIdAndRemove(request.params.id);

  if (!deletedGenre) {
    return response.status(404).send(`Sorry, we could not find genre with id ${request.params.id} to perform delete.`);
  }

  response.send(deletedGenre);
});

module.exports = router;
