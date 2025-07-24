const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/server.config');
const generateJWTtoken = (user) => {
  
  const token = JWT.sign({
    id: user._id,
    email: user.email,
  },
  JWT_SECRET,
  { expiresIn: '2h' }
  );
  
  return token;
};

const verifyJWTtoken = (token) => {
  return JWT.verify(token, JWT_SECRET);
};

module.exports = {
  generateJWTtoken,
  verifyJWTtoken,
};
