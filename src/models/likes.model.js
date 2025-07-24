const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  target_type: {
    type: String,
    enum: ['Question', 'Answer', 'Comment'],
    required: true
  },
 
}, { timestamps:true });

module.exports = mongoose.model('Like', likeSchema);
