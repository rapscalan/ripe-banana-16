const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: String,
    state: String,
    country: String
  }
});

schema.statics.findStudiosFilms = async function(id){
  const studio = await this
    .findById(id)
    .select({ __v: false})
  const films = await this.model('Film')
    .find({ studio: id })
    .select({ title: true });
  return { ...studio.toJSON(), films };
};

module.exports = mongoose.model('Studio', schema);
