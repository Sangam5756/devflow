const validator = require("validator");
const BadRequestError = require("../error/badrequest.error");

const validateAnswerBody = (answerBody) => {
  const answer = answerBody.answer;
  console.log(answerBody);
  if (!answer) {
    throw new BadRequestError("answer is required to make the request");
  }
};

module.exports = {
  validateAnswerBody,
};
