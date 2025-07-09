const UnauthorizedError = require("../error/unauthorize.error");
const NotFound = require("../error/notfound.error");
const BadRequestError = require("../error/badrequest.error");
const { generateJWTtoken } = require("../utils/jwt");
const { UserDataValidate } = require("../validation");
const bcrypt = require("bcrypt");


class UserService {
  constructor(UserRepository) {
    this.userRepository = UserRepository;
  }

  async login(userData) {
    UserDataValidate.loginDataValidate(userData);    
    const userExists = await this.userRepository.findUserByEmail(
      userData.email
    );
    if (!userExists) {
      throw new NotFound("User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(userData.password,userExists.password);

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
    UserDataValidate.signupDataValidate(userData);
    // check if user exists
    const isUser = await this.userRepository.findUserByEmail(userData.email);
    if (isUser) {
      throw new BadRequestError("User already exists");
    } 
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.createUser({...userData,password:hashedPassword});
    const token = generateJWTtoken(user);
    
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      bio: user?.bio,
    };
    // create user
    return {payload,token};
  }


  async getUserByUsername(username){
    const user = await this.userRepository.findUserByUsername(username);
    
    if(!user){
      throw new NotFound(`User not found with username ${username}`);
    }
    return user;
  }
}

module.exports = UserService;
