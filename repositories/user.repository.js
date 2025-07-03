const userModel = require("../models/user.model");

class UserRepository {
  async findUserByEmail(email) {
    const user = userModel.findOne({ email: email });
    return user;
  }

  async createUser(user) {
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
  }
}

module.exports = UserRepository;
