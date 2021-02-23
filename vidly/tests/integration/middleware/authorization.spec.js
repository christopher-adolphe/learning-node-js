// Loading superTest Module
const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

let server;
let token;


describe('authorization middleware', () => {
  beforeEach(() => { server = require('../../../index'); });

  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  const execRequest = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return a 401 status if no token is provided', async () => {
    token = '';

    const response = await execRequest();

    expect(response.status).toBe(401);
  });

  it('should return a 400 status if the token is invalid', async () => {
    token = 'a';

    const response = await execRequest();

    expect(response.status).toBe(400);
  });

  it('should return a 201 status if the token is valid', async () => {
    const response = await execRequest();

    expect(response.status).toBe(201);
  });
});
