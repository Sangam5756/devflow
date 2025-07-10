const UnauthorizedError = require("../error/unauthorize.error");
const { User } = require("../models");

const { verifyJWTtoken } = require("../utils/jwt");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    console.log("Token from cookies:", req.cookies.token);
    if (!token) {
      throw new UnauthorizedError("");
    }

    const decoded = verifyJWTtoken(token);

    const user = await User.findById(decoded.id).select("-password");
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}


module.exports = authMiddleware;
