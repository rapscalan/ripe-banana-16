require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('Actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actorArray = [];

  beforeEach(async() => {
    actorArray = await Promise.all([
      Actor.create({
        name: 'Humphrey Bogart',
        dob: new Date('1899-12-25'),
        pob: 'New York, New York'
      }),
      Actor.create({
        name: 'Marlon Brando',
        dob: new Date('1924-04-23'),
        pob: 'Omaha, Nebraska'
      })
    ]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create an actor', () => {
    const birthDate = new Date('1957-04-29');
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Daniel Day Lewis',
        dob: birthDate,
        pob: 'London, England'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Daniel Day Lewis',
          dob: birthDate.toISOString(),
          pob: 'London, England',
          __v: 0
        });
      });
  });

  it('can get all Actors', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        actorArray = JSON.parse(JSON.stringify(actorArray));
        actorArray.forEach(actor => {
          expect(res.body).toContainEqual(actor);
        });
      });
  });
});
