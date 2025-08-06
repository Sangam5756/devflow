const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { UserService } = require("../services");

const userService = new UserService(UserRepository);

/**
 * @route   POST /api/v1/user/login
 * @desc    Log in user and return JWT token
 * @access  Public
 */
async function login(req, res, next) {
  try {
    const userData = req.body;
    const { payload, token } = await userService.login(userData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: payload,
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @route   POST /api/v1/user/register
 * @desc    Register new user
 * @access  Public
 */
async function register(req, res, next) {
  try {
    const userData = req.body;
    const { payload } = await userService.createUser(userData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      error: false,
      data: payload,
      message: "Signup successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error);

    return next(error);
  }
}

/**
 * @route   GET /api/v1/users/:username
 * @desc    Get user profile by username
 * @access  Public
 */
async function getUser(req, res, next) {
  try {
    const username = req.params.username;
    const user = await userService.getUserByUsername(username);

    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
      message: "User found",
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Protected (require authentication)
 */
async function updateUser(req, res, next) {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUser:", error);

    return next(error);
  }
}

/**
 * @route   POST /api/v1/users/send-otp
 * @desc    Send OTP to user's email for verification
 * @access  Protected (only owner)
 */
async function sendEmailOtp(req, res, next) {
  try {
    const user = req.user;
    const { isVerified } = await userService.sendOtp(user);

    if (!isVerified) {
      return res.status(StatusCodes.OK).json({
        success: true,
        error: false,
        message: "otp sent successfull",
        data: null,
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      message: "already verified",
      data: null,
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);

    return next(error);
  }
}

/**
 * @route   POST /api/v1/users/verify-otp
 * @desc    Verify OTP sent to user's email
 * @access  Protected (only owner)
 */
async function verifyEmailOtp(req, res, next) {
  try {
    const userId = req.user.id;
    const otp = req.body.otp;

    const isVerified = await userService.verifyOtp({ userId, otp });
    if (isVerified) {
      res.status(StatusCodes.OK).json({
        message: "Email is Successfully Verified",
        error: false,
        success: true,
        data: null,
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUser,
  register,
  login,
  updateUser,
  sendEmailOtp,
  verifyEmailOtp,
};
