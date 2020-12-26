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
    max: 255,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  }
});

const Movie = mongoose.model('Movie', movieSchema);

const movieValidator = (movie) => {
  const validateMovie = Joi.object({
    title: Joi.string().min(2).max(250).required(),
    genreId: Joi.ojectId().required(),
    amountInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  });

  return validateMovie.validate(movie);
};

module.exports.Movie = Movie;
module.exports.validate = movieValidator;