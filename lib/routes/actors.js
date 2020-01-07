const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    Actor
      .create({ ...req.body })
      .then(actor => res.send(actor))
      .catch(next);
  });