const express = require("express");
const userRouter = require("./user.routes");
const QuestionRouter = require("./question.routes");
const answerRouter = require("./answer.route");
const followRouter = require("./follow.route");
const likes_dislikesRouter = require("./likes_dislike.route");

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/answer", answerRouter);
v1Router.use("/question", QuestionRouter);
v1Router.use("/follow", followRouter);
v1Router.use("/like", likes_dislikesRouter);

module.exports = v1Router;
