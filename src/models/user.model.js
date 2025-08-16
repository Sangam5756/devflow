const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: function () {
        return this.oauthProvider === "local";
      },
    },
    bio: {
      type: String,
    },
    oauthProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    avatarUrl: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
