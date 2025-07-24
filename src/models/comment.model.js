const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  text: {
    type: String,
    required: true
  },
 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('Comment', commentSchema); 