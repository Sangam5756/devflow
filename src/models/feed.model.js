const { default: mongoose } = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, // same as Question _id
    title: String,
    body: String,
    topics: [String],
    userId: {
      _id: mongoose.Schema.Types.ObjectId,
      username: String,
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feed", feedSchema);
