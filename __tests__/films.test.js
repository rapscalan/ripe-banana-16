require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');


describe('Film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let filmArray;
  let studio;
  let castArr;

  beforeEach(async() => {
    const birthDate = new Date('1967-10-05');
    studio = await Studio.create({
      name: 'MGM',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'USA'
      }
    });
    castArr = await Actor.create([
      {
        name: 'Guy Pearce',
        dob: birthDate,
        pob: 'Ely, England'
      },
      {
        name: 'Joe Pantoliano',
        dob: birthDate,
        pob: 'Hoboken, NJ'
      },
      {
        name: 'Naomi Watts',
        dob: birthDate,
        pob: 'Shoreham, England'
      },
      {
        name: 'Justin Theroux',
        dob: birthDate,
        pob: 'Washington, D.C.'
      }
    ]);
    filmArray = await Film.create([{
      title: 'Memento',
      studio: studio._id,
      released: 2000,
      cast: [
        {
          role: 'Leonard Shelby',
          actor: castArr[0]._id,
        }, 
        {
          role: 'John Edward "Teddy" Gammell',
          actor: castArr[1]._id
        }
      ]
    },
    {
      title: 'Mulholland Drive',
      studio: studio._id,
      released: 2001,
      cast: [
        {
          role: 'Betty',
          actor: castArr[2]._id
        },
        {
          role: 'Director',
          actor: castArr[3]._id
        }
      ]
    }
    ]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'L.A. Confidential',
        studio: studio._id,
        released: 1997,
        cast: [
          {
            role: 'Detective Exley',
            actor: castArr[0]._id
          },
          {
            role: 'Not in the movie',
            actor: castArr[2]._id          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            title: 'L.A. Confidential',
            studio: studio._id.toString(),
            released: 1997,
            cast: [
              {
                _id: expect.any(String),
                role: 'Detective Exley',
                actor: castArr[0]._id.toString(),
              },
              {
                _id: expect.any(String),
                role: 'Not in the movie',
                actor: castArr[2]._id.toString(),
              }
            ],
            __v: 0
          }
        );
      });
  });
});
