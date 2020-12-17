const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

router.get('/', async (request, response) => {
  try {
    const rentalList = await Rental.find().sort('-dateOut');

    response.send(rentalList);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching rentals: ${exception.message}`);
  }
});

router.post('/', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not create new rental because ${error.message}.`);
  }

  try {
    const customer = await Customer.findById(request.body.customerId);
    const movie = await Movie.findById(request.body.movieId);

    if (!customer) {
      return response.status(400).send(`Sorry, we could not find rental for customer with id ${request.body.customerId}.`);
    }

    if (!movie) {
      return response.status(400).send(`Sorry, we could not find rental for movie widh id ${request.body.movieId}.`);
    }

    if (movie.amountInStock === 0) {
      return response.status(400).send(`Sorry, this movie is out of stock.`);
    }

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });

    rental = await rental.save();

    movie.amountInStock--;

    await movie.save();

    response.status(201).send(rental);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while creating new rental: ${exception.message}`);
  }
});

module.exports =  router;
