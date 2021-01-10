const errorHandler = (error, request, response, next) => {
  response.status(500).send(`Sorry, something went wrong: ${error.message}`);
};

module.exports = errorHandler;
