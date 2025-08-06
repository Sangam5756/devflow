const express = require("express");
const { FeedController } = require("../../controller");

const feedRouter = express.Router();

feedRouter.get("/public", FeedController.getPublicFeed);

module.exports = feedRouter;
