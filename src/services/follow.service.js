const BadRequestError = require("../error/badrequest.error");
const NotFound = require("../error/notfound.error");

class FollowService {
  constructor(FollowRepository, UserRepository) {
    this.followRepository = FollowRepository;
    this.userRepository = UserRepository;
  }

  /**
   * Allows the current user to follow another user.
   * Throws an error if the user tries to follow themselves, if the target user does not exist,
   * or if the current user is already following the target user.
   *
   * @async
   * @param {Object} params - The parameters for following a user.
   * @param {string} params.currentUser - The ID of the current user performing the follow action.
   * @param {string} params.userId - The ID of the user to be followed.
   * @returns {Promise<Object>} An object containing the follower and following user IDs.
   * @throws {Error} If the current user tries to follow themselves.
   * @throws {NotFound} If the target user does not exist.
   * @throws {BadRequestError} If the current user is already following the target user.
   */

  async followUser({ currentUser, userId }) {
    if (currentUser === userId) {
      throw new Error("You cannot follow yourself.");
    }

    // check the user exists
    const user = await this.userRepository.findUserByEntitiy({ _id: userId });
    if (!user) {
      throw new NotFound("user not found");
    }

    // check its already following
    const alreadyFollowing = await this.followRepository.findOne({
      follower: currentUser,
      following: userId,
    });

    // if already following throw badrequest error
    if (alreadyFollowing) {
      throw new BadRequestError(`User Already Following the ${userId} `);
    }

    // create the new document
    await this.followRepository.create({
      follower: currentUser,
      following: userId,
    });

    return { follower: currentUser, following: userId };
  }

  /**
   * Unfollows a user for the current user.
   *
   * @async
   * @param {Object} params - The parameters for unfollowing a user.
   * @param {string} params.currentUser - The ID of the current user performing the unfollow.
   * @param {string} params.userId - The ID of the user to unfollow.
   * @throws {Error} If the current user tries to unfollow themselves.
   * @throws {NotFound} If the user to unfollow does not exist.
   * @throws {BadRequestError} If the current user is not following the specified user.
   * @returns {Promise<Object>} An object containing the ID of the unfollowed user.
   */

  async unFollowUser({ currentUser, userId }) {
    if (currentUser === userId) {
      throw new Error("You cannot unfollow yourself.");
    }

    // check the user exists
    const user = await this.userRepository.findUserByEntitiy({ _id: userId });
    if (!user) {
      throw new NotFound("user not found");
    }

    // check its relation with follower and current user exist
    const FollowExist = await this.followRepository.findOne({
      follower: currentUser,
      following: userId,
    });

    // if already following throw badrequest error
    if (!FollowExist) {
      throw new BadRequestError(`User Not following the ${userId} `);
    }

    // delete the  document
    await this.followRepository.delete({ _id: FollowExist._id });

    return { UnFollowed: userId };
  }

  /**
   * Retrieves a list of followers for a given user.
   *
   * @param {string|number} userId - The ID of the user whose followers are to be fetched.
   * @returns {Promise<Array>} A promise that resolves to an array of follower objects.
   */
  async getFollowers(userId) {
    const followService = await this.followRepository.getAllFollowers(userId);

    return followService.map((f) => f.follower);
  }

  /**
   * Retrieves a list of user IDs that the specified user is following.
   *
   * @param {string|number} userId - The ID of the user whose followings are to be fetched.
   * @returns {Promise<Array<string|number>>} A promise that resolves to an array of user IDs being followed.
   */
  async getFollowings(userId) {
    const followService = await this.followRepository.getAllFollowing(userId);

    return followService.map((f) => f.following);
  }
}

module.exports = FollowService;
