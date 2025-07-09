const userModel = require("../models/user.model");

class UserRepository {
  async findUserByEmail(email) {
    const user = userModel.findOne({ email: email });
    return user;
  }
  async findUserByUsername(username) {
    const user =userModel.findOne({ username: username });
    return user;
  }
  async createUser(user) {
    console.log(user);
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
  }
}

module.exports = UserRepository;
