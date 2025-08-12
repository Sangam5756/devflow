const { Answer } = require("../models");
const BaseRepository = require("./base.repository");

class AnswerRepository extends BaseRepository {
  constructor() {
    super(Answer);
  }

  async findAnswersByQuestionId(questionId) {
    return this.model
      .find({ questionId })
      .populate("userId", "name username")
      .lean();
  }

  async countAnswers(questionId) {
    return this.model.countDocuments(questionId);
  }
}

module.exports = new AnswerRepository();
