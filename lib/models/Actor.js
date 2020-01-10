const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  dob: Date,
  pob: String
});

schema.statics.findActorFilms = async function(id){
  const films = await this.model('Film')
    .find({ 'cast.actor': id });

  const actor = await this
    .findById(id);

  return { ...actor.toJSON(), films };

};
module.exports = mongoose.model('Actor', schema);
