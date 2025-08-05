const express = require("express");
const { QuestionController } = require("../../controller");
const AuthMiddleware = require("../../middleware/authMiddleware");

const questionRouter = express.Router();

questionRouter.get("/", AuthMiddleware, QuestionController.getQuestions);
questionRouter.get("/feed", QuestionController.getAllQuestions);
questionRouter.get("/:id", QuestionController.getQuestion);
questionRouter.post("/", AuthMiddleware, QuestionController.createQuestion);
questionRouter.put("/:id", AuthMiddleware, QuestionController.updateQuestion);
questionRouter.delete(
  "/:id",
  AuthMiddleware,
  QuestionController.deleteQuestion,
);

module.exports = questionRouter;
