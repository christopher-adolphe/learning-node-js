const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

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
  },
  isAdmin: {
    type: Boolean
  }
});

// Adding a method to the User model to handle generation of authentication token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));

  return token;
}

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
