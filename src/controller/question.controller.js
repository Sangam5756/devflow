const NotimplementedError = require("../error/notimplemented.error");

function createQuestion(req, res, next) {
  try {
    throw new NotimplementedError("createQuestion");
  } catch (error) {
    next(error);
  }
}

function updateQuestion(req, res, next) {
  try {
    throw new NotimplementedError("updateQuestion");
  } catch (error) {
    next(error);
  }
}

function deleteQuestion(req, res, next) {
  try {
    throw new NotimplementedError("deleteQuestion");
  } catch (error) {
    next(error);
  }
}

function getQuestion(req, res, next) {
  try {
    throw new NotimplementedError("getQuestion");
  } catch (error) {
    next(error);
  }
}
function getQuestions(req, res, next) {
  try {
    throw new NotimplementedError("getQuestions");
  } catch (error) {
    next(error);
  }
}


module.exports={
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion,
    getQuestions
}
