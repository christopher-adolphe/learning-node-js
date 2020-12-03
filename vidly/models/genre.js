const mongoose = require('mongoose');
const Joi =  require('joi');

// Defining a Genre schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  }
});

// Defining a Genre model
const Genre = mongoose.model('Genre', genreSchema);

// Defining a validator function for genre schema
const genreValidator = (genre) => {
  // Defining the schema constraints using Joi
  const validateGenre = Joi.object({
    name: Joi.string().min(2).max(50).required()
  });

  return validateGenre.validate(genre);
};

module.exports.Genre = Genre;
module.exports.validate = genreValidator;
