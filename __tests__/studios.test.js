require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('Studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let studioArray = [];
  beforeEach(async() => {
    studioArray = await Promise.all([
      Studio.create({ name: 'Miramax', 
        address: { 
          city: 'Los Angeles', 
          state: 'California',
          country: 'USA'
        }
      }),
      Studio.create({ name: 'Sony',
        address: {
          city: 'Hollywood',
          state: 'California',
          country: 'USA'
        }
      })
    ]);
    
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can get all the Studios', () => {
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        studioArray = JSON.parse(JSON.stringify(studioArray));
        studioArray.forEach(studio => {
          expect(res.body).toContainEqual(studio);
        });
      });      
  });

  it('can create a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'Paramount',
        address: {
          city: 'Culver City',
          state: 'California',
          country: 'USA'
        }  
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paramount',
          address: {
            city: 'Culver City',
            state: 'California',
            country: 'USA'
          },
          __v: 0
        });
      });
  });
});
