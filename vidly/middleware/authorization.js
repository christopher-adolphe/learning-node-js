const config = require('config');
const jwt = require('jsonwebtoken');

const authorize = (request, response, next) => {
  if (!config.get('requiresAuth')) {
    return next();
  }
  
  const token = request.header('x-auth-token');

  if (!token) {
    return response.status(401).send('Sorry, access denied because no authentication token was provided.');
  }

  try {
    const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));

    request.user = decodedPayload;
    next();
  } catch (exception) {
    return response.status(400).send('Sorry, the authentication token provided is invalid.');
  }
};

module.exports = authorize;
