const mongoose = require('mongoose');
const moment = require('moment');
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

// Creating a static method in the rentalSchema
rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  });
}

// Creating an instance method in the rentalSchema
rentalSchema.methods.return = function() {
  this.dateReturned = new Date();
  
  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('rental', rentalSchema);

const rentalValidator = (rental) => {
  const validateRental = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return validateRental.validate(rental);
};

module.exports.Rental = Rental;
module.exports.validateReturns = rentalValidator;
