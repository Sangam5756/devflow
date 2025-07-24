const { StatusCodes } = require("http-status-codes");
const { QuestionRepository } = require("../repositories");
const { QuestionService } = require("../services/");
const BadRequestError = require("../error/badrequest.error");
const mongoose = require("mongoose");

const questionService = new QuestionService(QuestionRepository);

/**
 * @route   POST /api/v1/question
 * @desc    Create a new question
 * @access  Protected (require authentication)
 */
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
    return next(error);
  }
}

/**
 * @route   GET /api/v1/question/:id
 * @desc    Get a question by ID
 * @access  Public
 */
async function getQuestion(req, res, next) {
  try {
    const questionId = req.params.id;

    const question = await questionService.getQuestion({ _id: questionId });

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "SuccessFull Retrived The Question",
      data: question,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @route   GET /api/v1/question
 * @desc    Get all questions
 * @access  Public
 */
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
    return next(error);
  }
}

/**
 * @route   PUT /api/v1/question/:id
 * @desc    Update a question
 * @access  Protected (only owner)
 */
async function updateQuestion(req, res, next) {
  try {
    const questionId = req.params.id;
    console.log(questionId);
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new BadRequestError("Invalid Question ID");
    }
    const payload = {
      questionId,
      userId: req.user.id,
      title: req.body.title,
      body: req.body.body,
      topics: req.body.topics,
    };
    const question = await questionService.updateQuestion(payload);

    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: question,
      message: "question updated successFully",
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @route   DELETE /api/v1/question/:id
 * @desc    Delete a question by ID
 * @access  Protected (only owner)
 */
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
    return next(error);
  }
}

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
};
