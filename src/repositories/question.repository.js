const { Question } = require("../models");
const BaseRepository = require("./base.repository");

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }
  async findAllQuestions(userInfo) {
    return this.model
      .find({ userId: userInfo.id })
      .populate({ path: "topics", select: "name" })
      .lean();
  }
  async findQuestion(questionId) {
    return this.model
      .findOne({ _id: questionId })
      .populate("userId", "name username")
      .lean();
  }

  async getPublicQuestions(limit) {
    const questions = await this.model
      .find({})
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return questions;
  }
}

module.exports = new QuestionRepository();
