const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Answer', answerSchema); 