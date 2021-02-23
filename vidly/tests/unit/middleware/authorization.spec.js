const moongoose = require('mongoose');
const { User } = require('../../../models/user');
const authorize = require('../../../middleware/authorization');

describe('authorization middleware', () => {
  it('should populate the request.user property with the payload of a valid JWT', () => {
    const user = {
      _id: moongoose.Types.ObjectId().toHexString(),
      isAdmin: true };
    const token = new User(user).generateAuthToken();
    const request = {
      header: jest.fn().mockReturnValue(token)
    };
    const response = {};
    const next = jest.fn();

    authorize(request, response, next);

    expect(request.user).toMatchObject(user);
  });
});