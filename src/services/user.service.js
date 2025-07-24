const UnauthorizedError = require("../error/unauthorize.error");
const NotFound = require("../error/notfound.error");
const BadRequestError = require("../error/badrequest.error");
const { generateJWTtoken } = require("../utils/jwt");
const { UserDataValidate } = require("../validation");
const bcrypt = require("bcrypt");
const { generateAndHashOtp } = require("../utils/helper");
const sendMailQueue = require("../queue/queue");
const redisClient = require("../config/redis");
const InternalServerError = require("../error/internalserver.error");

class UserService {
  constructor(UserRepository) {
    this.userRepository = UserRepository;
  }
  /**
   * @desc Authenticate user and return JWT token
   * @param {Object} userData - { email, password }
   * @returns {Object} - { token, payload }
   */
  async login(userData) {
    UserDataValidate.loginDataValidate(userData);
    const userExists = await this.userRepository.findUserByEntitiy({
      email: userData.email,
    });
    console.log(userExists);
    if (!userExists) {
      throw new NotFound("User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      userExists.password,
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

  /**
   * @desc Create a new user
   * @param {Object} userData - { email, password, username, [bio]}
   * @returns {Object} payload and token
   */
  async createUser(userData) {
    // validation
    UserDataValidate.signupDataValidate(userData);
    // check if user exists
    const isUser = await this.userRepository.findUserByEntitiy({
      email: userData.email,
    });
    if (isUser) {
      throw new BadRequestError("User already exists");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    const token = generateJWTtoken(user);

    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      bio: user?.bio,
    };

    return { payload, token };
  }

  /**
   * @desc Find user by username
   * @param {String} username
   * @returns {Object} user
   */
  async getUserByUsername(username) {
    const user = await this.userRepository.findUserByEntitiy({
      username: username,
    });

    if (!user) {
      throw new NotFound(`User not found with username ${username}`);
    }

    return user;
  }

  /**
   * @desc Update user info
   * @param {String} userId
   * @param {Object} updateData - { username, email, bio }
   * @returns {Object} updated user
   */
  async updateUser(userId, updateData) {
    const allowedFields = ["username", "email", "bio"];
    const updatePayload = {};

    for (const key of allowedFields) {
      if (updateData[key]) {
        updatePayload[key] = updateData[key];
      }
    }

    const updatedUser = await this.userRepository.updateUserById(
      userId,
      updatePayload,
    );
    if (!updatedUser) {
      throw new NotFound("User not found or update failed");
    }

    return updatedUser;
  }

  /**
   * @desc Send OTP for email verification
   * @param {Object} user - req.user
   * @returns {Object} { isVerified }
   */
  async sendOtp(user) {
    const isUser = await this.userRepository.findUserByEntitiy({
      email: user.email,
    });

    if (!isUser) {
      throw new NotFound("User not found");
    }

    if (!isUser.isVerified) {
      const { otp, hashedOtp } = await generateAndHashOtp();

      await redisClient.setex(`otp:${isUser._id}`, 300, hashedOtp);
      console.log(otp, hashedOtp);
      const emailPayload = {
        email: isUser?.email ? String(isUser.email) : "",
        subject: String("Otp for Email Verification"),
        message: String(`This is system generated otp ${otp}`),
      };

      await sendMailQueue.add("send_otp_email", emailPayload);

      return { isVerified: false };
    }

    return { isVerified: true };
  }

  /**
   * @desc Verify email OTP
   * @param {Object} userData - { userId, otp }
   * @returns {Boolean} - verification result
   */
  async verifyOtp(userData) {
    const { userId, otp } = userData;

    if (!otp || typeof otp !== "string" || otp.trim().length === 0) {
      throw new BadRequestError("OTP is required");
    }

    const user = await this.userRepository.findUserByEntitiy({ _id: userId });
    if (!user) {
      throw new NotFound("User not found");
    }

    if (user.isVerified) {
      return true;
    }

    const redisKey = `otp:${user._id}`;
    const hashedOtp = await redisClient.get(redisKey);
    console.log("inside the hashed", hashedOtp, otp);
    if (hashedOtp) {
      const isMatch = await bcrypt.compare(otp, hashedOtp);
      if (!isMatch) {
        throw new BadRequestError("Invalid OTP");
      }
    }

    const updatedUser = await this.userRepository.update(userId, {
      isVerified: true,
    });
    if (!updatedUser) {
      throw new InternalServerError(
        "Failed to update user verification status",
      );
    }

    await redisClient.del(redisKey);

    return true;
  }
}

module.exports = UserService;
