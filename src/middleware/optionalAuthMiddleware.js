const { User } = require("../models");

const { verifyJWTtoken } = require("../utils/jwt");

async function optionalAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  console.log(token);
  const decoded = verifyJWTtoken(token);
  const user = await User.findById(decoded.id).select("-password");

  req.user = decoded;

  return next();
}

module.exports = optionalAuthMiddleware;
