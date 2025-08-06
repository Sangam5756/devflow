const BaseRepository = require("./base.repository");
const { Like } = require("../models");

class LikesDislikesRepository extends BaseRepository {
  constructor() {
    super(Like);
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
