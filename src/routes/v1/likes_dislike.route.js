const express = require("express");
const { LikesController } = require("../../controller");
const authMiddleware = require("../../middleware/authMiddleware");

const likes_dislikesRouter = express.Router();

likes_dislikesRouter.post(
  "/like/:targetType/:targetId",
  authMiddleware,
  LikesController.like,
);
likes_dislikesRouter.post(
  "/dislike/:targetType/:targetId",
  authMiddleware,
  LikesController.dislike,
);

module.exports = likes_dislikesRouter;
