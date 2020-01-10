const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  rating: {
    type: Number,
    validate: {
      validator: function(v) {
        return v === 1 ||
          v === 2 ||
          v === 3 ||
          v === 4 ||
          v === 5;
      },
      message: props => `${props.value} is not an allowed rating`
    },
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer',
    required: true
  },
  review: {
    type: String,
    maxlength: 140,
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',
    required: true
  }
});

module.exports = mongoose.model('Review', schema);
