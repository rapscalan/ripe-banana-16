require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');


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
  let reviewArray;
  let reviewer;

  beforeEach(async() => {
    const birthDate = new Date('1967-10-05');

    reviewer = await Reviewer.create({
      name: 'Roger Ebert',
      company: 'Chicago Newspaper'
    });

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

    reviewArray = await Promise.all([
      Review.create({
        rating: 5,
        review: 'Great movie',
        reviewer: reviewer._id,
        film: filmArray[1]._id
      }),
      Review.create({
        rating: 2,
        review: 'Confusing movie',
        reviewer: reviewer._id,
        film: filmArray[1]._id
      })
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

  it('can get all films', () => {
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        filmArray = JSON.parse(JSON.stringify(filmArray));
        filmArray.forEach(film => {
          expect(res.body).toContainEqual(film);
        });
      });
  });

  it('can get all the data for a film', () => {
    return request(app)
      .get(`/api/v1/films/${filmArray[1]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          cast: expect.any(Array),
          released: 2001,
          reviews: expect.any(Array),
          title: 'Mulholland Drive',
          studio: expect.any(Object)
        });
      });
  });
});
