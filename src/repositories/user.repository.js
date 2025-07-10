const BaseRepository = require('./base.repository');
const userModel = require('../models/user.model');



class UserRepository extends BaseRepository {
  constructor() {
    super(userModel);
  }

  async findUserByEmail(email) {
    return this.model.findOne({ email });
  }

  async findUserByUsername(username) {
    return this.model.findOne({ username });
  }
}

module.exports = new UserRepository();
