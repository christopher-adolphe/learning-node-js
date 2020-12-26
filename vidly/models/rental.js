const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 2,
        maxlength: 250,
        required: true
      },
      phone: {
        type: String,
        minlength: 8,
        maxlength: 8,
        required: true
      },
      isGold: {
        type: Boolean,
        default: false
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 2,
        maxlength: 250,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0,
    required: true
  }
});

const Rental = mongoose.model('rental', rentalSchema);

const rentalValidator = (rental) => {
  const validateRental = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return validateRental.validate(rental);
};

module.exports.Rental = Rental;
module.exports.validate = rentalValidator;
