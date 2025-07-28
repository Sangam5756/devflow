const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    target_type: {
      type: String,
      enum: ["Question", "Answer"],
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ userId: 1, targetId: 1, target_type: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
