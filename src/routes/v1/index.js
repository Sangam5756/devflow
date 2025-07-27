const express = require("express");
const userRouter = require("./user.routes");
const QuestionRouter = require("./question.routes");
const answerRouter = require("./answer.route");
const followRouter = require("./follow.route");

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/answer", answerRouter);
v1Router.use("/question", QuestionRouter);
v1Router.use("/follow", followRouter);

module.exports = v1Router;
