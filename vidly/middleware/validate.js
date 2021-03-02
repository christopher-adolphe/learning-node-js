const validate = (validator) => {
  return (request, response, next) => {
    const { error } = validator(request.body);

    if (error) {
      return response.status(400).send(`Sorry, we could not process return because ${error.message}.`);
    }

    next();
  };
}

module.exports = validate;
