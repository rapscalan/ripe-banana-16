require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

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
    const studio = await Studio
      .create({
        name: 'MGM',
      });

    await Promise.all([
      Film.create({
        title: 'The Maltese Falcon',
        studio: studio._id,
        released: 1942,
        cast: [{
          role: 'Detective',
          actor: actorArray[0]._id
        }]
      }),
      Film.create({
        title: 'Casa Blanca',
        studio: studio._id,
        released: 1943,
        cast: [{
          role: 'Joe',
          actor: actorArray[0]._id
        }]
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

  it('can get an actor and their films', () => {
    return request(app)
      .get(`/api/v1/actors/${actorArray[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          dob: '1899-12-25T00:00:00.000Z',
          pob: 'New York, New York',
          name: 'Humphrey Bogart',
          films: expect.any(Array)
        });
      });
  });
});
