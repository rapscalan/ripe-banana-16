require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('Reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let reviewerArray = [];

  beforeEach(async() => {
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
    // reviewerArray = await Reviewer.create([
    //   {
    //     name: 'Gene Siskel',
    //     company: 'Chicago Tribune'
    //   },
    //   {
    //     name: 'Roger Ebert',
    //     company: 'Other Chicago Paper'
    //   }
    // ]);
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
});
