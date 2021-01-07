const config = require('config');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const router = express.Router();
const { User, validate } = require('../models/user');
const authorize = require('../middleware/authorization');

router.get('/me', authorize, async (request, response) => {
  try {
    const user = await User.findById(request.user._id).select('-password');
    
    response.status(200).send(user);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured: ${exception.message}`);
  }
});

router.post('/', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not register new user because ${error.message}.`);
  }

  try {
    let user = await User.findOne({ email: request.body.email });

    if (user) {
      return response.status(400).send(`Sorry, a user has already been registered with the supplied details.`);
    }
    
    user = new User({ ...request.body });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    // Using lodash pick() method to select only keys of an object
    response.status(201).header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while registering new genre: ${exception.message}`);
  }
});

module.exports = router;
