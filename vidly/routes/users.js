const express =  require('express');
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

    await user.save();

    response.status(201).send(user);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while registering new genre: ${exception.message}`)
  }
});

module.exports = router;
