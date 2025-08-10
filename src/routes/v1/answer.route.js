const express = require("express");
const { AnswerController } = require("../../controller");
const AuthMiddleware = require("../../middleware/authMiddleware");
const answerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: API to manage answers to questions
 */

/**
 * @swagger
 * /answer/question/{questionId}:
 *   get:
 *     summary: Get all answers for a question
 *     description: Optionally filter by parentAnswerId to fetch replies.
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to get answers for
 *       - in: query
 *         name: parentAnswerId
 *         schema:
 *           type: string
 *         description: Optional ID of a parent answer to fetch replies
 *     responses:
 *       200:
 *         description: List of answers returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Answer'
 */
answerRouter.get(
  "/question/:questionId",
  AnswerController.getAnswersByQuestion,
);

/**
 * @swagger
 * /answer/{answerId}:
 *   get:
 *     summary: Get a single answer by ID
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer to fetch
 *     responses:
 *       200:
 *         description: Answer found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       404:
 *         description: Answer not found
 */
answerRouter.get("/:answerId", AnswerController.getAnswerById);

/**
 * @swagger
 * /answer/{questionId}:
 *   post:
 *     summary: Create a new answer for a question
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to answer
 *     requestBody:
 *       description: Answer content and optionally parentAnswerId for replies
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 type: string
 *                 example: "This is an answer."
 *               parentAnswerId:
 *                 type: string
 *                 nullable: true
 *                 example: "64e0b8f4c9d5a2a1f1d8f3b7"
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized (authentication required)
 */
answerRouter.post(
  "/:questionId",
  AuthMiddleware,
  AnswerController.createAnswer,
);

/**
 * @swagger
 * /answer/{answerId}:
 *   put:
 *     summary: Update an existing answer (only owner can update)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer to update
 *     requestBody:
 *       description: Updated answer content
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *                 example: "Updated answer content."
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       401:
 *         description: Unauthorized to update answer
 *       404:
 *         description: Answer not found
 */
answerRouter.put("/:answerId", AuthMiddleware, AnswerController.updateAnswer);

/**
 * @swagger
 * /answer/{answerId}:
 *   delete:
 *     summary: Delete an answer (only owner can delete)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer to delete
 *     responses:
 *       200:
 *         description: Answer deleted successfully
 *       401:
 *         description: Unauthorized to delete answer
 *       404:
 *         description: Answer not found
 */
answerRouter.delete(
  "/:answerId",
  AuthMiddleware,
  AnswerController.deleteAnswer,
);

module.exports = answerRouter;
