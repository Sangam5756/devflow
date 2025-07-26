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
      parentAnswerId: answerBody.parentAnswerId || null,
    };

    const answer = await this.answerRepository.create(payload);

    return answer;
  }

  //  Recursive helper to delete the answer when the parentAnswer deleted
  async _deleteRepliesRecursive(parentId) {
    const replies = await this.answerRepository.findAll({
      parentAnswerId: parentId,
    });
    for (const reply of replies) {
      // recursively we are calling same function for each reply to question
      await this._deleteRepliesRecursive(reply._id);
      await this.answerRepository.delete(reply._id);
    }
  }

  /**
   * @desc Delete Answer
   * @param {Object|String} answerBody - questionId
   * @returns {Object} deleted answer
   */
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

    // Step 3: Recursive delete child replies
    await this._deleteRepliesRecursive(answerId);

    // Step 4: Delete the answer itself
    await this.answerRepository.delete(answerId);

    return answer;
  }

  /**
   * @desc get  Answer by question
   * @param {String} questionId -
   * @returns {Object} new answer
   */
  async getAnswerbyQuestion({ questionId, parentAnswerId }) {
    const question = await this.answerRepository.findAll({
      questionId: questionId,
      parentAnswerId: parentAnswerId,
    });

    return question;
  }

  async getAnswerById(answerId) {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      throw new NotFound(`answer with ${answerId} not found`);
    }

    return answer;
  }

  async updateAnswer(answerBody) {
    const answer = await this.answerRepository.findOne({
      _id: answerBody.answerId,
    });
    // if answer is not found then return not found
    if (!answer) {
      throw new NotFound(`Answer with ${answerBody.answerId} not found`);
    }
    // if answer is found check the answer is belong to that user
    const userId = answerBody.id;
    if (answer.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError("Not Authorized to update the answer");
    }

    // if the answer is found take the body and update the answer
    if (answerBody.answer) {
      answer.answer = answerBody.answer;
    }
    console.log(answerBody);
    // return the updated answer to the user
    const updatedAnswer = await answer.save();
    console.log(updatedAnswer);

    return updatedAnswer;
  }
}

module.exports = AnswerService;
