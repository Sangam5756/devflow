const { StatusCodes } = require('http-status-codes');
const BaseError = require('./base.error');

class NotFound extends BaseError {
  constructor(message) {
    super('NOT FOUND', StatusCodes.NOT_FOUND, message, {});
  }
}

module.exports = NotFound;
