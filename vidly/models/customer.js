const mongoose = require('mongoose');
const Joi = require('joi');

// Defining a Customer schema
const customerSchema = new mongoose.Schema({
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
});

// Defining a Customer model
const Customer = mongoose.model('Customer', customerSchema);

const customerValidator = (customer) => {
  const validateCustomer = Joi.object({
    name: Joi.string().minlength(2).maxlength(250).required(),
    phone: Joi.string().minlength(8).maxlength(8).required()
  });

  return validateCustomer.validate(customer);
};

module.exports.Customer = Customer;
module.exports.validate = customerValidator;
