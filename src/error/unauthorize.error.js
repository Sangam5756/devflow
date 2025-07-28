const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base.error");

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized", details = {}) {
    super("Unauthorized", StatusCodes.UNAUTHORIZED, message, details);
  }
}

module.exports = UnauthorizedError;
