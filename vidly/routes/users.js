const express =  require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, validate } = require('../models/user');

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
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();

    // Using lodash pick() method to select only keys of an object
    response.status(201).send(_.pick(user, ['name', 'email']));
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while registering new genre: ${exception.message}`)
  }
});

module.exports = router;
