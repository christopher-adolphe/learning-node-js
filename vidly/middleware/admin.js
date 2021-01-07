const authorizeAdmin = (request, response, next) => {
  if (!request.user.isAdmin) { 
    return response.status(403).send('Sorry, access denied because user is not an admin.');
  }

  next();
};

module.exports = authorizeAdmin;
