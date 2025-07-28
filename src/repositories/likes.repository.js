const BaseRepository = require("./base.repository");
const { Like } = require("../models");

class LikesDislikesRepository extends BaseRepository {
  constructor() {
    super(Like);
  }
}
module.exports = new LikesDislikesRepository();
