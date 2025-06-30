const NotimplementedError = require("../error/notimplemented.error");

function updateUser(req, res) {
  try {
    res.status(200).send("User update is not implemented yet");
  } catch (error) {
    console.error("Error in updateUser:", error);
  }
}



function login(req, res) {
  try {
    res.status(200).send("User login is not implemented yet");
  } catch (error) {
    console.error("Error in login:", error);
  }
}

function signup(req, res) {
  try {
    res.status(200).send("User signup is not implemented yet");
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

module.exports = {
  getUser,
  signup,
  login,
  updateUser
};
