const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Topic name is required"],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: (v) => typeof v === "string" && v.trim().length > 0,
      message: "Topic name must be a non-empty string",
    },
  },
});
module.exports = mongoose.model("Topic", topicSchema);
