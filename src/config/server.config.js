const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "jwtSecret",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/quora",
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};
