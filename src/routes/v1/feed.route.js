const express = require("express");
const { FeedController } = require("../../controller");
const optionalAuthMiddleware = require("../../middleware/optionalAuthMiddleware");

const feedRouter = express.Router();

/**
 * @swagger
 * /feed/public:
 *   get:
 *     summary: Get public feed of questions with likes and dislikes count
 *     tags: [Feed]
 *     description: Returns a list of public questions enriched with likes and dislikes counts. Default limit is 20.
 *     responses:
 *       200:
 *         description: Successfully retrieved public feed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64e0b8f4c9d5a2a1f1d8f3b7"
 *                   title:
 *                     type: string
 *                     example: "How to document APIs using Swagger?"
 *                   body:
 *                     type: string
 *                     example: "I want to know how to write Swagger doc comments for my NodeJS API."
 *                   userId:
 *                     type: string
 *                     example: "64dc1234abcd5678efgh9012"
 *                   topics:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "javascript"
 *                   likes:
 *                     type: integer
 *                     example: 12
 *                   dislikes:
 *                     type: integer
 *                     example: 3
 *                   replies:
 *                     type: integer
 *                     example: 3
 *                   isLike:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-08-10T08:00:00Z"
 */
feedRouter.get("/public", optionalAuthMiddleware, FeedController.getPublicFeed);

module.exports = feedRouter;
