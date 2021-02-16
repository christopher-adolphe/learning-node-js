const { iteratee } = require("lodash");
// Loading superTest Module
const request = require('supertest');
let server;

describe('/api/genres', () => {
  // Using beforeEach() to open a connection to the test database
  beforeEach(() => {
    // Loading the Server Module
    server = require('../../index');
  });

  // Using afterEach() to close the connection to the test database after each test case
  afterEach(() => { server.close(); });

  describe('get genres', () => {
    it('should return all genres', async () => {
      const response = await request(server).get('/api/genres');

      expect(response.status).toBe(200);
    });
  })
});