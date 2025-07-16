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

  async getAllQuestions(userInfo){
    const questions = await this.questionRepository.findAll({userId:userInfo.id});
    return questions;
  }

}


module.exports =QuestionService;
