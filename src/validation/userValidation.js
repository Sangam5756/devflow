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

  if (!validator.isLength(password, { min: 6 })) {
    throw new BadRequestError("Password must be at least 6 characters");
  }
};

const signupDataValidate = (signupData) => {
  const { username, email, password } = signupData;
  if (!email || !password || !username) {
    throw new BadRequestError("missing Required Fields");
  }
  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid Email Address");
  }
  if (!validator.isLength(password, { min: 6 })) {
    throw new BadRequestError("Password must be at least 6 characters");
  }
};

module.exports = { loginDataValidate, signupDataValidate };
