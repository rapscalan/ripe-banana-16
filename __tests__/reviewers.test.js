require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('Reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let reviewerArray = [];
  let reviewArray;
  let filmArray;
  let studio;
  let castArr;
  let birthDate = new Date('1970-12-25');
  beforeEach(async() => {
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
    reviewerArray = await Promise.all([
      Reviewer.create({
        name: 'Gene Siskel',
        company: 'Chicago Tribune'
      }),
      Reviewer.create({
        name: 'Roger Ebert',
        company: 'Other Chicago Paper'
      })
    ]);

    filmArray = await Film.create({
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

    reviewArray = await Review.create([
      {
        rating: 5,
        reviewer: reviewerArray[0]._id,
        review: 'What a good movie',
        film: filmArray._id
      },
      {
        rating: 1,
        reviewer: reviewerArray[0]._id,
        review: 'What a bad movie',
        film: filmArray._id
      }
    ]);
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ 
        name: 'Tom Smith',
        company: 'Newspaper'
      })
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.any(String),
            name: 'Tom Smith',
            company: 'Newspaper',
            __v: 0
          });
      });
  });

  it('can get a reviewer and their reviews', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewerArray[0].id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          company: 'Chicago Tribune',
          name: 'Gene Siskel',
          reviews: expect.any(Array)
        });
      });
  });

  it('can get all reviewers', () => {
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        reviewerArray = JSON.parse(JSON.stringify(reviewerArray));
        reviewerArray.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });

  it('can update a reviewer', () => {
    return request(app)
      .patch(`/api/v1/reviewers/${reviewerArray[0].id}`)
      .send({ company: 'Boston Globe' })
      .then(res => {
        expect(res.body.company).toEqual('Boston Globe');
      });
  });
});
