const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Rental, validateReturns } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const authorize = require('../middleware/authorization');
const validate = require('../middleware/validate');

router.post('/', [authorize, validate(validateReturns)], async (request, response) => {
  const rental = await Rental.lookup(request.body.customerId, request.body.movieId);

  if (!rental) {
    return response.status(404).send(`Sorry, we could not process return because ${error.message}.`);
  }

  if (rental.dateReturned) {
    return response.status(400).send(`Sorry, this return has already been processed ${error.message}.`);
  }

  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { amountInStock: 1 }
  });

  response.send(rental);
});

module.exports = router;
