const { FeedService } = require("../services");

const {
  QuestionRepository,
  AnswerRepository,
  LikesRepository,
} = require("../repositories");
const { StatusCodes } = require("http-status-codes");

const feedService = new FeedService(
  QuestionRepository,
  LikesRepository,
  AnswerRepository,
);

const getPublicFeed = async (req, res, next) => {
  try {
    const feed = await feedService.getPublicFeed();

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: feed,
      message: "feed retrived successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicFeed,
};
