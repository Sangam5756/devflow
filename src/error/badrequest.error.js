const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base.error.js");

class BadRequestError extends BaseError {
  constructor(message) {
    super("Bad Request", StatusCodes.BAD_REQUEST, message, {});
  }
}

module.exports = BadRequestError;
