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
    const userId = req?.user?.id;
    const limit = parseInt(req.query.limit, 20) || 20;
    const feed = await feedService.getPublicFeed(limit, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      error: false,
      data: feed,
      message: "feed retrived successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPublicFeed,
};
