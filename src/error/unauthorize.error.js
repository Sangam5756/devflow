const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base.error");

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super("Unauthorized", StatusCodes.UNAUTHORIZED, message, {});
  }
}

module.exports = UnauthorizedError;
