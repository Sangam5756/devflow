const express = require("express");
const { LikesController } = require("../../controller");
const authMiddleware = require("../../middleware/authMiddleware");

const likes_dislikesRouter = express.Router();

/**
 * @swagger
 * /like/likes_dislikes/like/{targetType}/{targetId}:
 *   post:
 *     summary: Like a target entity (Question or Answer)
 *     tags: [LikesDislikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         description: The type of the target entity ("Question" or "Answer")
 *         schema:
 *           type: string
 *           enum: [Question, Answer]
 *           example: Question
 *       - in: path
 *         name: targetId
 *         required: true
 *         description: The ID of the target entity to like
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     responses:
 *       200:
 *         description: Like registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "64dc1234abcd5678efgh9012"
 *                 targetId:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85e"
 *                 target_type:
 *                   type: string
 *                   example: "Question"
 *                 type:
 *                   type: string
 *                   example: "like"
 *       400:
 *         description: Bad request (e.g., invalid target type, already liked)
 *       404:
 *         description: Target entity not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
likes_dislikesRouter.post(
  "/like/:targetType/:targetId",
  authMiddleware,
  LikesController.like,
);

/**
 * @swagger
 * /like/likes_dislikes/dislike/{targetType}/{targetId}:
 *   post:
 *     summary: Dislike a target entity (Question or Answer)
 *     tags: [LikesDislikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         description: The type of the target entity ("Question" or "Answer")
 *         schema:
 *           type: string
 *           enum: [Question, Answer]
 *           example: Answer
 *       - in: path
 *         name: targetId
 *         required: true
 *         description: The ID of the target entity to dislike
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85f"
 *     responses:
 *       200:
 *         description: Dislike registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "64dc1234abcd5678efgh9012"
 *                 targetId:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85f"
 *                 target_type:
 *                   type: string
 *                   example: "Answer"
 *                 type:
 *                   type: string
 *                   example: "dislike"
 *       400:
 *         description: Bad request (e.g., invalid target type, already disliked)
 *       404:
 *         description: Target entity not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
likes_dislikesRouter.post(
  "/dislike/:targetType/:targetId",
  authMiddleware,
  LikesController.dislike,
);

module.exports = likes_dislikesRouter;
