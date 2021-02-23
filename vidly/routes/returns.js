const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const authorize = require('../middleware/authorization');

router.post('/', async (request, response) => {
  const { error } = validate(request.body);

  if (!request.body.customerId) {
    return response.status(400).send(`Sorry, we could not process return because ${error.message}.`);
  }

  if (!request.body.movieId) {
    return response.status(400).send(`Sorry, we could not process return because ${error.message}.`);
  }

  const rental = await Rental.findOne({
    'customer._id': request.body.customerId,
    'movie._id': request.body.movieId
  });

  if (!rental) {
    return response.status(404).send(`Sorry, we could not process return because ${error.message}.`);
  }

  response.status(401).send('Unauthorized');
});

module.exports = router;
