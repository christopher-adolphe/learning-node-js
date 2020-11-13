const authentication = (request, response, next) => {
  console.log('Authenticating...');
  next();
};

module.exports = authentication;
