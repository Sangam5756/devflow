const BaseRepository = require("./base.repository");
const { Like } = require("../models");

class LikesDislikesRepository extends BaseRepository {
  constructor() {
    super(Like);
  }

  async isUserLiked(targetId, targetType, userId) {
    const likeDoc = await Like.findOne({
      userId,
      targetId,
      target_type: targetType,
      type: "like",
    }).lean();

    return !!likeDoc; // returns true if found, else false
  }

  async countLikes(targetId, targetType) {
    return await this.model
      .countDocuments({
        targetId,
        target_type: targetType,
        type: "like",
      })
      .lean();
  }
  async countDislikes(targetId, targetType) {
    return await this.model
      .countDocuments({
        targetId,
        target_type: targetType,
        type: "dislike",
      })
      .lean();
  }
}
module.exports = new LikesDislikesRepository();
