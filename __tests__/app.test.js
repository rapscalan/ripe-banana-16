require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can signup a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  
});
