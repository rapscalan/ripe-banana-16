require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Chance = require('chance').Chance();
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');

describe('Review routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let reviewArray = [];
  let film;
  let reviewer;

  beforeEach(async() => {

    const birthDate = new Date('1968-09-28');
    const studio = await Studio.create({
      name: 'MGM',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'USA'
      }
    });
    const castArr = await Actor.create([
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
    film = await Film.create({
      title: 'Mulholland Drive',
      studio: studio._id,
      released: 2001,
      cast: [
        {
          role: 'Betty',
          actor: castArr[0]._id
        },
        {
          role: 'Director',
          actor: castArr[1]._id
        }
      ]
    });
    reviewer = await Reviewer.create({
      name: 'Joe',
      company: 'Times'
    });
    reviewArray = await Promise.all([...Array(120)].map(() =>
      Review
        .create({
          rating: Chance.integer({ min: 1, max: 5 }),
          reviewer: reviewer._id,
          review: 'Good Movie',
          film: film._id
        })
    ));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 5,
        reviewer: reviewer._id,
        review: 'Like a dream',
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            rating: 5,
            reviewer: reviewer._id.toString(),
            review: 'Like a dream',
            film: film._id.toString(),
            __v: 0
          }
        );
      });
  });

  it('can get all the reviews', () => {
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        reviewArray = JSON.parse(JSON.stringify(reviewArray));
        
        reviewArray.sort((a, b)=>b.rating - a.rating).slice(100).forEach(review => {
          expect(res.body)
            .toContainEqual({
              _id: expect.any(String),
              rating: review.rating,
              review: review.review,
              film: {
                _id: film.id,
                title: film.title,
              }
            });
        });
      });
  });
});
