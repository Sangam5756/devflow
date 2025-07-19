const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../error/badrequest.error");
const NotimplementedError = require("../error/notimplemented.error");
const { QuestionRepository } = require("../repositories");
const { QuestionService } = require("../services/");
const { Question } = require("../models");
const { default: mongoose } = require("mongoose");

const questionService = new QuestionService(QuestionRepository);

async function createQuestion(req, res, next) {
  try {
    const question = await questionService.createQuestion({
      ...req.user,
      ...req.body,
    });

    if (!question) {
      throw new BadRequestError("something went wrong");
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      error: false,
      data: question,
      message: "Question Successfully Created",
    });
  } catch (error) {
    next(error);
  }
}

async function getQuestions(req, res, next) {
  try {
    const questions = await questionService.getAllQuestions(req.user);
    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "retrieved All Question",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteQuestion(req, res, next) {
  try {
    const questionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new BadRequestError("Invalid Question ID");
    }
    const payload = {
      questionId: req.params.id,
      userId: req.user.id,
    };
    await questionService.deleteQuestion(payload);

    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: null,
      message: `question with id ${questionId} deleted successFully`,
    });
  } catch (error) {
    next(error);
  }
}

async function updateQuestion(req, res, next) {
  try {
    const questionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new BadRequestError("Invalid Question ID");
    }
    const payload = {
      questionId: req.params.id,
      userId: req.user.id,
      title: req.body.title,
      body: req.body.body,
    };
    const question = await questionService.updateQuestion(payload);

    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: question,
      message: "question updated successFully",
    });
  } catch (error) {
    next(error);
  }
}

function getQuestion(req, res, next) {
  try {
    throw new NotimplementedError("getQuestion");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
};
