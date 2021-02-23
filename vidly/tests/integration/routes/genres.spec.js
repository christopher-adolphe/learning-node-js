const mongoose = require('mongoose');
// Loading superTest Module
const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

describe('/api/genres', () => {
  let server;

  // Using beforeEach() to open a connection to the test database
  beforeEach(() => {
    // Loading the Server Module
    server = require('../../../index');
  });

  // Using afterEach() to close the connection to the test database after each test case
  afterEach( async () => {
    // Closing the connection to the test database
    await server.close();
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

    it('should return a 404 status given the id is provided does not exist', async () => {
      const id = mongoose.Types.ObjectId();
      const response = await request(server).get(`/api/genres/${id}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /', () => {
    /**
     * Refactoring tips for clean tests
     * Define the happy path, then in each test case change one parameter
     * that clearly aligns with the name of the test.
    */
   let token;
   let name;

    const execRequest = async () => {
      return await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    it('should return a 401 status if the user is not logged in', async () => {
      token = ''
      const response = await execRequest();

      expect(response.status).toBe(401);
    });

    it('should return a 400 status if new genre is less than 2 characters', async () => {
      name = 'g';
      const response = await execRequest();

      expect(response.status).toBe(400);
    });

    it('should return a 400 status if new genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const response = await execRequest();

      expect(response.status).toBe(400);
    });

    it('should return a 400 status if new genre is not of type string', async () => {
      const invalidTypeParams = [null, undefined, NaN, true, 12345, { id: 125, name: 'name1' }];

      for (const invalidType of invalidTypeParams) {
        name = invalidType;
        const response = await execRequest();

        expect(response.status).toBe(400);
      }
    });

    it('should save the new genre and return a 201 status if it is valid', async () => {
      const response = await execRequest();
      const newGenre = await Genre.find({ name });

      expect(newGenre).not.toBeNull();
      expect(response.status).toBe(201);
    });

    it('should return the new genre in the body of response if it is valid', async () => {
      const response = await execRequest();

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', name);
    });
  });

  describe('PUT /:id', () => {
    let token;
    let updatedName;
    let genre;
    let id;

    const execRequest = async () => {
      return await request(server)
      .put(`/api/genres/${id}`)
      .set('x-auth-token', token)
      .send({ name: updatedName });
    }

    beforeEach(async () => {
      token = new User().generateAuthToken();

      genre = new Genre({ name: 'genre1' });
      id = genre._id.toHexString();
      updatedName = 'genre2';
      await genre.save();
    });

    it('should return a 401 status given the user is not logged in', async () => {
      token = '';

      const response = await execRequest();

      expect(response.status).toBe(401);
    });

    it('should return a 400 status given the genre is less than 2 characters', async () => {
      updatedName = 'g';
        
      const response = await execRequest();

      expect(response.status).toBe(400);
    });

    it('should return a 400 status given the genre is more than 50 characters', async () => {
      updatedName = new Array(52).join('a');
        
      const response = await execRequest();

      expect(response.status).toBe(400);
    });

    it('should return a 400 status given the genre is not of type string', async () => {
      const invalidTypeParams = [null, undefined, NaN, 1234, true, { id: 1324 }];

      for (const param of invalidTypeParams){
        updatedName = param;

        const response = await execRequest();

        expect(response.status).toBe(400);
      }
    });

    it('should return a 404 status given the id does not exist', async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const response = await execRequest();

      expect(response.status).toBe(404);
    });

    it('should update and return the updated genre in the body of the response with a 200 status given the id is valid', async () => {
      const response = await execRequest();
      const updatedGenre = await Genre.findById(id);

      expect(updatedGenre).not.toBeNull();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', id);
      expect(response.body).toHaveProperty('name', updatedName);
    });
  });

  describe('DELETE /:id', () => {
    const admin = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    let token;
    let id;

    const execRequest = async () => {
      return await request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token', token);
    };

    beforeEach(async () => {
      token = new User(admin).generateAuthToken();

      const genre = new Genre({ name: 'genre1' });
      id = genre._id.toHexString();
      await genre.save();
    });

    it('should return a 401 status given the user is not logges in', async () => {
      token = '';
      const response = await execRequest();

      expect(response.status).toBe(401);
    });

    it('should return a 403 status given the user is not an admin', async () => {
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: false
      };
      token = new User(user).generateAuthToken();

      const response = await execRequest();

      expect(response.status).toBe(403);
    });

    it('should return a 404 status given the id does not exist', async () => {
      id = mongoose.Types.ObjectId().toHexString();
      const response = await execRequest();

      expect(response.status).toBe(404);
    });

    it('should delete and return the deleted genre in the body of the response with a 200 status given the id is valid', async () => {
      const response = await execRequest();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', id);
      expect(response.body).toHaveProperty('name', 'genre1');
    });
  });
});