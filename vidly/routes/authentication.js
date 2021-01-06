const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/user');

const validate = (user) => {
  const validateUser = Joi.object({
    email: Joi.string().min(2).max(255).required().email(),
    password: Joi.string().min(2).max(255).required()
  });

  return validateUser.validate(user);
};

router.post('/', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not authenticate user because ${error.message}.`);
  }

  try {
    let user = await User.findOne({ email: request.body.email });

    if (!user) {
      return response.status(400).send(`Sorry, we could not authenticate because the username or password is incorrect.`);
    }

    // Using bcrypt's compare() method to check the supplied password against the hashed password
    const isPasswordValid = await bcrypt.compare(request.body.password, user.password);

    if (!isPasswordValid) {
      return response.status(400).send(`Sorry, we could not authenticate because the username or password is incorrect.`);
    }

    // Using 'export' to set 'vidly_jwtPrivateKey' as an environment variable to be used in the config
    const token = user.generateAuthToken();

    response.send(token);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while registering new genre: ${exception.message}`);
  }
});

module.exports = router