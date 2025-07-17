const bcrypt = require("bcrypt");
const {randomInt} = require("crypto");


const generateOtp =()=>{
    return randomInt(100000,999999).toString();     
}

const generateAndHashOtp = async () => {
  const otp = generateOtp();
  const hashedOtp =await bcrypt.hash(otp, 10);
  return { otp, hashedOtp };
};

module.exports = {
  generateOtp,
  generateAndHashOtp
};