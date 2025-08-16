const { verifyJWTtoken } = require("../utils/jwt");

async function optionalAuthMiddleware(req, res, next) {
  const token =
    req?.cookies?.token || req?.headers["authorization"]?.split(" ")[1];

  console.log(token);
  if (!token) {
    return next();
  }
  const decoded = verifyJWTtoken(token);
  req.user = decoded;

  return next();
}

module.exports = optionalAuthMiddleware;
