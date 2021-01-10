const errorHandler = (error, request, response, next) => {
  response.status(500).send(`Sorry, something went wrong: ${exception.message}`);
};

module.exports = errorHandler;
