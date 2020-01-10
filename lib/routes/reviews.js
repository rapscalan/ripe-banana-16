const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    Review
      .create({ ...req.body })
      .then(review => res.send(review))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Review
      .find()
      .populate('film', { title: true })
      .sort({ rating: -1 })
      .limit(100)
      .select('-__v -reviewer')
      .then(review => res.send(review))
      .catch(next);
  });
