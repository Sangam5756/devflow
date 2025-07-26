const { AnswerService } = require("../services");
const { AnswerRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const answerService = new AnswerService(AnswerRepository);

/**
 * @route POST /api/v1/answer
 * @desc Create New answer for question
 * @access Protected (requires authentication)
 */
async function createAnswer(req, res, next) {
  try {
    const questionId = req.params.questionId;
    const answerBody = {
      ...req.body,
      ...req.user,
      questionId,
    };

    const createAnswer = await answerService.createAnswer(answerBody);

    return res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "Answer created successfully",
      data: createAnswer,
    });
  } catch (error) {
    return next(error);
  }
}

// Get all answers for a specific question
async function getAnswersByQuestion(req, res, next) {
  try {
    const questionId = req.params.questionId;
    const parentAnswerId = req.query.parentAnswerId;
    const question = await answerService.getAnswerbyQuestion({
      questionId: questionId,
      parentAnswerId: parentAnswerId || null,
    });
    res.status(StatusCodes.OK).json({
      message: "answer retrived successfully",
      data: question,
      success: true,
      error: false,
    });
  } catch (error) {
    return next(error);
  }
}

// Get a specific answer by ID
async function getAnswerById(req, res, next) {
  try {
    const answerId = req.params.answerId;

    const answer = await answerService.getAnswerById(answerId);

    res.status(StatusCodes.OK).json({
      message: `answer with ${answerId} is retrived successfully`,
      data: answer,
      success: true,
      error: false,
    });
  } catch (error) {
    return next(error);
  }
}

// Update an existing answer
async function updateAnswer(req, res, next) {
  try {
    const answerId = req.params.answerId;
    const answerBody = {
      ...req.user,
      answerId,
      answer: req.body.answer,
    };
    const answer = await answerService.updateAnswer(answerBody);

    res.status(StatusCodes.OK).json({
      message: "answer updated successfully",
      data: answer,
      success: true,
      error: false,
    });
  } catch (error) {
    return next(error);
  }
}

// Delete an answer
async function deleteAnswer(req, res, next) {
  try {
    const answerId = req.params.answerId;
    const answerBody = {
      ...req.user,
      answerId,
    };

    const deleteAnswer = await answerService.deleteAnswer(answerBody);

    return res.status(StatusCodes.OK).json({
      error: false,
      success: true,
      message: "Answer Deleted successfully",
      data: deleteAnswer,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
};
