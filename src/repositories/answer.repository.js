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
}

module.exports = new AnswerRepository();
