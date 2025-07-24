const express = require("express");
const userRouter = require("./user.routes");
const QuestionRouter = require("./question.routes");

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/question", QuestionRouter);

module.exports = v1Router;
