const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
});

schema.statics.findReviewerReviews = async function(id){
  const reviewer = await this
    .findById(id)
    .select({ name: true, company: true });
  const reviews = await this.model('Review')
    .find({ reviewer: id })
    .populate('reviewer')
    .populate('film', { title: true })
    .select({ reviewer: false, __v: false });

  return { ...reviewer.toJSON(), reviews };
};


module.exports = mongoose.model('Reviewer', schema);
