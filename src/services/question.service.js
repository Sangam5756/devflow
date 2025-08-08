const mongoose = require("mongoose");
const NotFound = require("../error/notfound.error");
const UnauthorizedError = require("../error/unauthorize.error");
const { Topics } = require("../models");
const { QuestionValidate } = require("../validation");

class QuestionService {
  constructor(QuestionRepository, LikesRepository, AnswerRepository) {
    this.questionRepository = QuestionRepository;
    this.likesRepository = LikesRepository;
    this.answerRepository = AnswerRepository;
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
  async getQuestion({ _id, userId }) {
    const question = await this.questionRepository.findQuestion(_id);

    if (!question) {
      throw new NotFound("Question not found");
    }

    // likes count for question
    const likes = await this.likesRepository.countLikes(_id, "Question");

    // isLiked for logged-in user
    const isLiked = userId
      ? !!(await this.likesRepository.findOne({
          userId,
          targetId: _id,
          target_type: "Question",
          type: "like",
        }))
      : false;

    // isOwner for question
    const isOwner = userId
      ? String(question.userId._id) === String(userId)
      : false;

    // get all answers
    const answers = await this.answerRepository.findAnswersByQuestionId(_id);

    // enrich answers with likes, isLiked & isOwner
    const enrichedAnswers = await Promise.all(
      answers.map(async (ans) => {
        const ansLikes = await this.likesRepository.countLikes(
          ans._id,
          "Answer",
        );
        const ansIsLiked = userId
          ? !!(await this.likesRepository.findOne({
              userId,
              targetId: ans._id,
              target_type: "Answer",
              type: "like",
            }))
          : false;

        const ansIsOwner = userId
          ? String(ans.userId._id) === String(userId)
          : false;

        return {
          id: ans._id,
          content: ans.answer,
          author: {
            name: ans.userId.name,
            username: ans.userId.username,
          },
          likes: ansLikes,
          timestamp: ans.createdAt,
          isLiked: ansIsLiked,
          isOwner: ansIsOwner,
        };
      }),
    );

    return {
      id: question._id,
      content: question.body,
      author: {
        name: question.userId.name,
        username: question.userId.username,
      },
      likes,
      answer: answers.length,
      timestamp: question.createdAt,
      isLiked,
      isOwner,
      answers: enrichedAnswers,
    };
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
