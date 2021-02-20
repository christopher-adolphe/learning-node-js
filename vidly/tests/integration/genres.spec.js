const { iteratee } = require("lodash");
// Loading superTest Module
const request = require('supertest');
const { Genre } = require('../../models/genre');
let server;

describe('/api/genres', () => {
  // Using beforeEach() to open a connection to the test database
  beforeEach(() => {
    // Loading the Server Module
    server = require('../../index');
  });

  // Using afterEach() to close the connection to the test database after each test case
  afterEach( async () => {
    server.close();
    // Removing test data from the database after running the test
    await Genre.remove({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ]);

      const response = await request(server).get('/api/genres');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(genre => genre.name === 'genre1')).toBeTruthy();
      expect(response.body.some(genre => genre.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre given a valid id is provided', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const response = await request(server).get(`/api/genres/${genre._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', genre.name);
    });

    it('should return a 404 status given an invalid id is provided', async () => {
      const response = await request(server).get('/api/genres/1');

      expect(response.status).toBe(404);
    });
  });
});