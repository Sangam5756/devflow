const { Question } = require("../models");
const BaseRepository = require("./base.repository");

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }
  async findAllQuestions(userInfo) {
    return this.model
      .find({ userId: userInfo.id })
      .populate({ path: `topics`, select: "name" });
  }
  async findQuestion(questionId) {
    return this.model
      .find({ _id: questionId })
      .populate({ path: `topics`, select: "name" });
  }
}

module.exports = new QuestionRepository();
