const log = (request, response, next) => {
  console.log('Logging...');

  // Passing control to the next middleware function in the request pipeline
  next();
};

module.exports = log;
