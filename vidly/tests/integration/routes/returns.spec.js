const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../../models/rental');
const { Movie } = require('../../../models/movie');
const { User } = require('../../../models/user');

describe('/api/returns', () => {
  let server;
  let token;
  let customerId;
  let movieId;
  let rental;
  let movie;

  const execRequest = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    
    movie = new Movie({
      _id: movieId,
      title: 'movie title',
      genre: {
        name: 'Horror'
      },
      amountInStock: 3,
      dailyRentalRate: 2
    });

    await movie.save();

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
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  // it('should work', async () => {
  //   const result = await Rental.findById(rental._id);

  //   expect(result).not.toBeNull();
  // });

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
    await Rental.remove({});

    const response = await execRequest();

    expect(response.status).toBe(404);
  });

  it('should return a 400 status given the return has already been processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const response = await execRequest();

    expect(response.status).toBe(400);
  });

  it('should return a 200 status given the return is valid', async () => {
    const response = await execRequest();

    expect(response.status).toBe(200);
  });

  it('should set #dateReturned given the return is valid', async () => {
    await execRequest();

    const savedRental = await Rental.findById(rental._id);
    const timeInterval = new Date() - savedRental.dateReturned;

    expect(savedRental.dateReturned instanceof Date).toBeTruthy();
    expect(timeInterval).toBeLessThan(10 * 1000);
  });

  it('should set #rentalFee given the return is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    await execRequest();

    const savedRental = await Rental.findById(rental._id);

    expect(savedRental.rentalFee).toBe(14);
  });

  it('should increase the amount in stock given the return is valid', async () => {
    await execRequest();

    const savedMovie = await Movie.findById(movieId);

    expect(savedMovie.amountInStock).toBe(movie.amountInStock + 1);
  });

  it('should return the updated rental in the body of the response given the return is valid', async () => {
    const response = await execRequest();

    await Rental.findById(rental._id);

    expect(Object.keys(response.body)).toEqual(
      expect.arrayContaining(['customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee'])
    );
  });
});