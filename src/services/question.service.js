const NotFound = require("../error/notfound.error");
const UnauthorizedError = require("../error/unauthorize.error");
const { QuestionValidate } = require("../validation");

class QuestionService {
  constructor(QuestionRepository) {
    this.questionRepository = QuestionRepository;
  }

  async createQuestion(questionBody) {
    QuestionValidate.validateQuestionBody(questionBody);
    const userId = questionBody.id;
    const payload = {
      title: questionBody.title,
      body: questionBody.body,
      userId: userId,
    };

    const question = this.questionRepository.create(payload);

    return question;
  }

  async getAllQuestions(userInfo) {
    const questions = await this.questionRepository.findAll({
      userId: userInfo.id,
    });
    return questions;
  }

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

  async updateQuestion(questionBody) {
    const { userId, questionId, body, title } = questionBody;

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new NotFound(`Question with ID ${questionId} not found`);
    }

    if (question.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Not authorized to update this question");
    }

    // update the db
    question.title = title;
    question.body = body;
    question.topics = [];
    await question.save();
    return question;
  }
}

module.exports = QuestionService;
