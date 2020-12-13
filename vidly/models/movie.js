const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 250,
    required: true
  },
  genre: {
    type: genreSchema,
    required: true
  },
  amountInStock: {
    type: Number,
    min: 0,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    required: true
  }
});

const Movie = mongoose.model('Movie', movieSchema);

const movieValidator = (movie) => {
  const validateMovie = Joi.object({
    title: Joi.string().min(2).max(250).required(),
    genre: Joi.required(),
    amountInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0)
  });

  return validateMovie.validate(movie);
};

module.exports.Movie = Movie;
module.exports.validate = movieValidator;