const { StatusCodes } = require("http-status-codes");
const NotimplementedError = require("../error/notimplemented.error");
const { UserRepository } = require("../repositories");
const { UserService } = require("../services");

const userService = new UserService(UserRepository);



async function login(req, res, next) {
  try {
    const userData = req.body;
    const { payload, token } = await userService.login(userData);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
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
    next(error);
  }
}

async function register(req, res,next) {
  try {
    const userData = req.body;
    const { payload, token } = await userService.createUser(userData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      error: false,
      data: payload,
      message: "Signup successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    next(error)
  }
}

async function getUser(req, res, next) {
  try {
    const username = req.params.username;
    const user = await userService.getUserByUsername(username);
   

    res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: {
        id:user._id,
        username:user.username,
        email:user.email,
        bio:user.bio
      },
      message: "User found",
    });
    


  } catch (error) {
    next(error);
    console.error("Error in getUser:", error);
  }
}

function updateUser(req, res) {
  try {
    res.status(200).send("User update is not implemented yet");
  } catch (error) {
    console.error("Error in updateUser:", error);
  }
}



function sendEmailOtp (req,res,next){
  // send
  try {
    throw NotimplementedError("VerifyEmail");
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    next(error)
  }
}

function verifyEmailOtp(req,res,next){  
  try {
    throw NotimplementedError("VerifyEmailOtp");
  } catch (error) {
    next(error)
  }
}



module.exports = {
  getUser,
  register,
  login,
  updateUser,
};
