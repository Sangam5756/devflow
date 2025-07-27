const express = require("express");
const { FollowController } = require("../../controller");
const authMiddleware = require("../../middleware/authMiddleware");

const followRouter = express.Router();

followRouter.post("/:userId", authMiddleware, FollowController.followUser);
followRouter.delete("/:userId", authMiddleware, FollowController.unFollowUser);
followRouter.get("/followers/:userId", FollowController.getFollowers);
followRouter.get("/following/:userId", FollowController.getFollowing);

module.exports = followRouter;
