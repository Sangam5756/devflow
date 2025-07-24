const mongoose = require("mongoose");
const NotFound = require("../error/notfound.error");
const UnauthorizedError = require("../error/unauthorize.error");
const { Topics } = require("../models");
const { QuestionValidate } = require("../validation");

class QuestionService {
  constructor(QuestionRepository) {
    this.questionRepository = QuestionRepository;
  }

  /**
   * @desc    Creates a new question with user-provided data
   * @param   {Object} questionBody - title, body, topics, and user ID
   * @returns {Object} created question
   */
  async createQuestion(questionBody) {
    QuestionValidate.validateQuestionBody(questionBody);

    const userId = questionBody.id;

    const payload = {
      title: questionBody.title,
      body: questionBody.body,
      userId: userId,
    };

    const question = await this.questionRepository.create(payload);

    return question;
  }

  /**
   * @desc    Retrieves all questions
   * @param   {string} userId - the user making the request
   * @returns {Array} list of questions
   */
  async getAllQuestions(userInfo) {
    const questions = await this.questionRepository.findAllQuestions(userInfo);

    return questions;
  }

  /**
   * @desc    Retrieves a single question by ID
   * @param   {String|Object} questionId
   * @returns {Object} question
   */
  async getQuestion(questionId) {
    const question = await this.questionRepository.findQuestion(questionId);

    return question;
  }

  /**
   * @desc    Deletes a question if the user is the owner
   * @param   {Object} question - contains questionId and userId
   * @throws  {NotFoundError|UnauthorizedError}
   * @returns {Object} deleted question
   */
  async deleteQuestion(question) {
    const userId = question.userId;

    const isQuestion = await this.questionRepository.findOne({
      _id: question.questionId,
    });
    if (!isQuestion) {
      throw new NotFound(`resourse not found with ${question.questionId}`);
    }
    const isOwner = await this.questionRepository.findOne({
      _id: question.questionId,
      userId: userId,
    });

    if (!isOwner) {
      throw new UnauthorizedError("Not Authorized to Do this Operation");
    }

    const questions = await this.questionRepository.delete({
      _id: question.questionId,
    });

    return questions;
  }

  /**
   * @desc Update a question if a user is the owner
   * @param {Object} questionBody - includes  title,body,topic,questionId,userId
   * @throws {NotFoundError| UnauthorizedError}
   * @returns {Object} - Updated Documents
   */
  async updateQuestion(questionBody) {
    const { userId, questionId, body, title, topics } = questionBody;

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new NotFound(`Question with ID ${questionId} not found`);
    }

    if (question.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Not authorized to update this question");
    }

    if (title !== undefined) {
      question.title = title;
    }

    if (body !== undefined) {
      question.body = body;
    }

    if (Array.isArray(topics)) {
      const cleanedNames = topics.map((t) => t.trim().toLowerCase());

      const newTopicDocs = await Promise.all(
        cleanedNames.map(async (name) => {
          const existing = await Topics.findOne({ name });
          if (existing) {
            return existing;
          }

          return await Topics.create({ name });
        }),
      );

      const mergedTopicIds = new Set([
        ...question.topics.map((id) => id.toString()),
        ...newTopicDocs.map((t) => t._id.toString()),
      ]);

      question.topics = Array.from(mergedTopicIds).map(
        (id) => new mongoose.Types.ObjectId(id),
      );
    }

    await question.save();

    return question.populate({ path: "topics", select: "name" });
  }
}

module.exports = QuestionService;
