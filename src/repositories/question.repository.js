const { Question } = require("../models");
const BaseRepository = require("./base.repository");

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }
}
