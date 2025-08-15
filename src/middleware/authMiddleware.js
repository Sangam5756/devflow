const UnauthorizedError = require("../error/unauthorize.error");
const { User } = require("../models");

const { verifyJWTtoken } = require("../utils/jwt");

async function authMiddleware(req, _res, next) {
  try {
    const token =
      req?.cookies?.token || req?.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Unauthenticated Request ,please log in");
    }

    const decoded = verifyJWTtoken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new UnauthorizedError("unauthorized");
    }
    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError(
          "Session expired. Please log in again.",
          "token is expired",
        ),
      );
    }

    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token. Please log in again."));
    }

    return next(error);
  }
}

module.exports = authMiddleware;
