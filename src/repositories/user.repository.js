const BaseRepository = require('./base.repository');
const userModel = require('../models/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(userModel);
  }

  async findUserByEntitiy(entity) {
    console.log(entity);
    
    return this.model.findOne(entity);
  }

  async updateUserById(userId, updateData) {
    return this.model.findByIdAndUpdate(userId, updateData);
  }
}

module.exports = new UserRepository();
