const UnauthorizedError = require("../error/unauthorize.error");
const bcrypt = require("bcrypt");
const { generateJWTtoken } = require("../utils/jwt");
const NotFound = require("../error/notfound.error");
const loginDataValidate = require("../validation/userValidation");


class UserService {
  constructor(UserRepository) {
    this.userRepository = UserRepository;
  }

  async login(userData) {
    loginDataValidate(req.body);
    const userExists = await this.userRepository.findUserByEmail(
      userData.email
    );
    if (!userExists) {
      throw new NotFound("User does not exist");
    }
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      userExists.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid Credentials");
    }

    const token = generateJWTtoken(userExists);

    const payload = {
      _id: userExists._id,
      email: userExists.email,
      username: userExists.username,
      bio: userExists.bio,
    };
    return {
      token,
      payload,
    };
  }

  async createUser(userData) {
    // validation
    const user = await this.userRepository.createUser(userData);
    return user;
  }
}

module.exports = UserService;
