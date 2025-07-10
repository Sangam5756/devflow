const express = require("express");
const { QuestionController } = require("../../controller");



const questionRouter = express.Router();

questionRouter.get("/",QuestionController.getQuestion);
questionRouter.get("/:QuestionId",QuestionController.getQuestions);
questionRouter.post("/",QuestionController.createQuestion); 
questionRouter.put("/",QuestionController.updateQuestion);
questionRouter.delete("/",QuestionController.deleteQuestion);


module.exports = questionRouter;