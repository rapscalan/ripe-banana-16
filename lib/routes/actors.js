const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    Actor
      .create({ ...req.body })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    //only _id and name?? TODO
    Actor
      .find()
      .then(actors => res.send(actors))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Actor
      .findActorFilms(req.params.id)
      .then(result => res.send(result))
      .catch(next);
  });
