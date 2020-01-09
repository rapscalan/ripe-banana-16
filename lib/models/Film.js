const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true,
    min: 1000,
    max: 9999
  },
  cast: [{
    role: String,
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

schema.statics.getFilmData = async function(id){
  const film = await this
    .findById(id)
    .populate('studio', { name: true })
    .populate('cast.actor', { name: true })
    .select({ __v: false });
  
  const reviews = await this.model('Review')
    .find({ film: id })
    .populate('reviewer', { name: true })
    .select({ film: false, __v: false });
  return { ...film.toJSON(), reviews };
};

module.exports = mongoose.model('Film', schema);
