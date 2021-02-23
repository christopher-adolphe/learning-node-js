const moongoose = require('mongoose');

const validateObjectId = (request, response, next) => {
  if (!moongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(404).send(`Sorry, we could not find this resource because id ${request.params.id} is invalid.`)
  }

  next();
};

module.exports = validateObjectId;
