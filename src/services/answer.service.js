const NotFound = require("../error/notfound.error");
const UnauthorizedError = require("../error/unauthorize.error");
const { validateAnswerBody } = require("../validation/answerValidation");

class AnswerService {
  constructor(AnswerRepository) {
    this.answerRepository = AnswerRepository;
  }

  /**
   * @desc Create new Answer
   * @param {Object} answerBody - {questionId,answer,userId}
   * @returns {Object} new answer
   */
  async createAnswer(answerBody) {
    validateAnswerBody(answerBody);

    const payload = {
      userId: answerBody.id,
      answer: answerBody.answer,
      questionId: answerBody.questionId,
    };
    const answer = await this.answerRepository.create(payload);

    return answer;
  }

  async deleteAnswer(answerBody) {
    const { id: userId, answerId } = answerBody;

    // Step 1: Check if the answer exists
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      throw new NotFound(`Answer with ID ${answerId} not found`);
    }

    // Step 2: Check if the current user is the owner
    if (answer.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Not authorized to delete this answer");
    }

    // Step 3: Proceed to delete
    await this.answerRepository.delete(answerId);

    return answer;
  }
}

module.exports = AnswerService;
