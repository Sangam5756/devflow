const { StatusCodes } = require("http-status-codes");
const NotimplementedError = require("../error/notimplemented.error");
const {UserRepository} = require("../repositories");
const {UserService} = require("../services");

const userService = new UserService(new UserRepository());


async function login(req, res) {
  try {
    const userData = req.body;
    const user = await userService.login(userData);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: user,
      message: "User logged in successfully"
    });
  } catch (error) {
    next(error);
  }
}



async function register(req, res) {
  try {
    const userData = req.body;
    const user =await userService.createUser(userData);
    res.status(200).json({message:"User signup is not implemented yet",data:user});
  } catch (error) {
    console.error("Error in signup:", error);
  }
}



function getUser(req, res,next) {
  try {

    throw  NotimplementedError("getUser");
    
    
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






module.exports = {
  getUser,
  register,
  login,
  updateUser
};
