const BadRequestError = require("../error/badrequest.error");

const validateQuestionBody = (questionBody) => {
  const { title, body } = questionBody;
  if (!title || !body) {
    throw new BadRequestError("title and body are required");
  }
};

module.exports = {
  validateQuestionBody,
};
