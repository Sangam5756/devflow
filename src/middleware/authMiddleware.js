const UnauthorizedError = require("../error/unauthorize.error");
const { User } = require("../models");

const { verifyJWTtoken } = require("../utils/jwt");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    console.log("Token from cookies:", req.cookies.token);
    if (!token) {
      throw new UnauthorizedError("Unauthenticated Request ,please log in");
    }

    const decoded = verifyJWTtoken(token);
    console.log(decoded);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new UnauthorizedError("unauthorized");
    }
    req.user = decoded;

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authMiddleware;
