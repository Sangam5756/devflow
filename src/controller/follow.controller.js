const { FollowService } = require("../services");
const { FollowRepository, UserRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const followService = new FollowService(FollowRepository, UserRepository);

async function followUser(req, res, next) {
  try {
    const userId = req.params.userId;
    const currentUser = req.user.id;

    const follow = await followService.followUser({ userId, currentUser });

    res.status(StatusCodes.CREATED).json({
      message: `Succesfully followed the user with id ${userId} `,
      success: true,
      error: false,
      data: follow,
    });
  } catch (error) {
    return next(error);
  }
}

async function unFollowUser(req, res, next) {
  try {
    const userId = req.params.userId;
    const currentUser = req.user.id;

    const follow = await followService.unFollowUser({ userId, currentUser });

    res.status(StatusCodes.CREATED).json({
      message: `Succesfully Unfollowed the user with id ${userId} `,
      success: true,
      error: false,
      data: follow,
    });
  } catch (error) {
    return next(error);
  }
}
async function getFollowers(req, res, next) {
  try {
    const userId = req.params.userId;

    const follow = await followService.getFollowers(userId);

    res.status(StatusCodes.CREATED).json({
      message: `Succesfully retrived the followers `,
      success: true,
      error: false,
      data: follow,
    });
  } catch (error) {
    return next(error);
  }
}
async function getFollowing(req, res, next) {
  try {
    const userId = req.params.userId;

    const follow = await followService.getFollowings(userId);

    res.status(StatusCodes.CREATED).json({
      message: `Succesfully retrived the followings `,
      success: true,
      error: false,
      data: follow,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
};
