const { StatusCodes } = require("http-status-codes");
const BaseError = require("../error/base.error");

function errorHandler(err, req, res, _next) {
  if (err instanceof BaseError) {
    return res.status(err.statuscode).json({
      success: false,
      message: err.message,
      error: err.details,
      data: {},
    });
  }
  console.log(err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went Wrong",
    error: err.message || "An unexpected error occurred",
    data: {},
  });
}

module.exports = errorHandler;
