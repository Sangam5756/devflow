const { Follow } = require("../models");
const BaseRepository = require("./base.repository");

class FollowRepository extends BaseRepository {
  constructor() {
    super(Follow);
  }

  async getAllFollowers(userId) {
    return this.model
      .find({ following: userId })
      .populate("follower", "-email -password -bio -isVerified -__v");
  }
  async getAllFollowing(userId) {
    return this.model
      .find({ follower: userId })
      .populate("following", "-email -password -bio -isVerified -__v");
  }
}

module.exports = new FollowRepository();
