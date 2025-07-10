const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  target_type: {
    type: String,
    enum: ['Question', 'Answer', 'Comment'],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Like', likeSchema);