const express = require("express");
const { FollowController } = require("../../controller");
const authMiddleware = require("../../middleware/authMiddleware");

const followRouter = express.Router();

/**
 * @swagger
 * /follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to follow
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     responses:
 *       200:
 *         description: Successfully followed the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 follower:
 *                   type: string
 *                   example: "64dc1234abcd5678efgh9012"
 *                 following:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85e"
 *       400:
 *         description: Bad request (e.g., trying to follow yourself or already following)
 *       404:
 *         description: User to follow not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
followRouter.post("/:userId", authMiddleware, FollowController.followUser);

/**
 * @swagger
 * /follow/{userId}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to unfollow
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UnFollowed:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85e"
 *       400:
 *         description: Bad request (e.g., trying to unfollow yourself or not following)
 *       404:
 *         description: User to unfollow not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
followRouter.delete("/:userId", authMiddleware, FollowController.unFollowUser);

/**
 * @swagger
 * /follow/followers/{userId}:
 *   get:
 *     summary: Get all followers of a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: User ID to get followers for
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     responses:
 *       200:
 *         description: List of followers returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64dc1234abcd5678efgh9012"
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   username:
 *                     type: string
 *                     example: "janedoe"
 */
followRouter.get("/followers/:userId", FollowController.getFollowers);

/**
 * @swagger
 * /follow/following/{userId}:
 *   get:
 *     summary: Get all users that a user is following
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: User ID to get following list for
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     responses:
 *       200:
 *         description: List of users the user is following returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64dc1234abcd5678efgh9012"
 *                   name:
 *                     type: string
 *                     example: "John Smith"
 *                   username:
 *                     type: string
 *                     example: "johnsmith"
 */
followRouter.get("/following/:userId", FollowController.getFollowing);

module.exports = followRouter;
