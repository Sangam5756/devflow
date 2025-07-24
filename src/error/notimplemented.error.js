const { StatusCodes } = require('http-status-codes');
const BaseError = require('./base.error');

class NotimplementedError extends BaseError {
  constructor(methodName) {
    super('NotImplemented',
      StatusCodes.NOT_IMPLEMENTED,
      `${methodName} Method is Not Implemented`,
      {}
    );
  }

}

module.exports = NotimplementedError;
