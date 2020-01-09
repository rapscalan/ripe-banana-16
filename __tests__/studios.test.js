require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('Studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let studioArray = [];
  let filmArray;

  beforeEach(async() => {
    studioArray = await Promise.all([
      Studio.create({ 
        name: 'Miramax', 
        address: { 
          city: 'Los Angeles', 
          state: 'California',
          country: 'USA'
        }
      }),
      Studio.create({ 
        name: 'Sony',
        address: {
          city: 'Hollywood',
          state: 'California',
          country: 'USA'
        }
      })
    ]);
    
    filmArray = await Promise.all([
      Film.create({
        title: 'The Godfather',
        studio: studioArray[1]._id,
        released: 1971,
        cast: []
      }),
      Film.create({
        title: 'The Godfather II',
        studio: studioArray[1]._id,
        released: 1973,
        cast: []
      })
    ]);
  });

  afterAll(() => {
    return mongoose.connection.close();
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

  it('can get all the films for a studio', () => {
    return request(app)
      .get(`/api/v1/studios/${studioArray[1]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Sony',
          address: expect.any(Object),
          films: expect.any(Array)
        });
      });
  });
});
