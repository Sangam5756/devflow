const { Answer } = require("../models");
const BaseRepository = require("./base.repository");

class AnswerRepository extends BaseRepository {
  constructor() {
    super(Answer);
  }
}

module.exports = new AnswerRepository();
