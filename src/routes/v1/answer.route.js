const express = require("express");
const { AnswerController } = require("../../controller");
const AuthMiddleware = require("../../middleware/authMiddleware");
const answerRouter = express.Router();

/**
 * @route GET /api/v1/answer/question/:question
 * @desc  get all answer for a specific question
 * @access Public
 */
answerRouter.get(
  "/question/:questionId",
  AnswerController.getAnswersByQuestion,
);

/**
 * @route GET /api/v1/answer/:answerId
 * @desc  get single answer by  its ID
 * @access Public
 */
answerRouter.get("/:answerId", AnswerController.getAnswerById);

/**
 * @route POST /api/v1/answer/:questionId
 * @desc Create New answer for question
 * @access Protected (requires authentication)
 */
answerRouter.post(
  "/:questionId",
  AuthMiddleware,
  AnswerController.createAnswer,
);

/**
 * @route PUT /api/v1/answer/:answerId
 * @desc Update the existing answer
 * @access Protected (only answer owner)
 */
answerRouter.put("/:answerId", AnswerController.updateAnswer);

/**
 * @route DELETE /api/v1/answer/:answerId
 * @desc Delete an Answer
 * @access Protected (only answer owner)
 */
answerRouter.delete(
  "/:answerId",
  AuthMiddleware,
  AnswerController.deleteAnswer,
);

module.exports = answerRouter;
