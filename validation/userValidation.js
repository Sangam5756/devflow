const validator = require("validator");
const BadRequestError = require("../error/badrequest.error");

const loginDataValidate = (loginData) => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid email format");
  }

  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters");
  }
};

module.exports = loginDataValidate;
