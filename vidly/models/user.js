const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 255,
    required: true
  },
  password: {
    type: String,
    minlength: 2,
    maxlength: 1024,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

const userValidator = (user) => {
  const validateUser = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(255).required().email(),
    password: Joi.string().min(2).max(255).required()
  });

  return validateUser.validate(user);
};

module.exports.User = User;
module.exports.validate = userValidator;
