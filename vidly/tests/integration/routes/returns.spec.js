const mongoose = require('mongoose');
const request = require('supertest');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');

describe('/api/returns', () => {
  let server;
  let token;
  let customerId;
  let movieId;
  let rental;

  const execRequest = async () => {
    return await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'john',
        phone: '12345678'
      },
      movie: {
        _id: movieId,
        title: 'movie title',
        dailyRentalRate: 2
      },
      rentalFee: 0
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it('should return a 401 status if the user is not logged in', async () => {
    token = '';

    const response = await execRequest();

    expect(response.status).toBe(401);
  });

  it('should return a 400 status given customerId is not provided', async () => {
    customerId = '';

    const response = await execRequest();

    expect(response.status).toBe(400);
  });

  it('should return a 400 status given movieId is not provided', async () => {
    movieId = '';

    const response = await execRequest();

    expect(response.status).toBe(400);
  });

  it('should return a 404 status given no rental exists for customerId and movieId provided', async () => {
    Rental.remove({});

    const response = await execRequest();

    expect(response.status).toBe(404);
  });
});