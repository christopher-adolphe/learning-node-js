const asyncMiddleware = (handler) => {
  return async (request, response, next) => {
    try {
      await handler(request, response);
    } catch (exception) {
      // Using the next() method to pass control to the error middleware function
      next(exception);
    }
  }
};

module.exports = asyncMiddleware;
