const { verifyJWTtoken } = require("../utils/jwt");

async function optionalAuthMiddleware(req, res, next) {
  try {
    const token =
      req?.cookies?.token || req?.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return next();
    }
    const decoded = verifyJWTtoken(token);

    req.user = decoded;

    return next();
  } catch (error) {
    next();
  }
}

module.exports = optionalAuthMiddleware;
