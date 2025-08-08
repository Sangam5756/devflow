const { StatusCodes } = require("http-status-codes");
const {
  LikesRepository,
  QuestionRepository,
  AnswerRepository,
} = require("../repositories");
const { LikeService } = require("../services");

const likeService = new LikeService(
  LikesRepository,
  QuestionRepository,
  AnswerRepository,
);

async function like(req, res, next) {
  try {
    const targetId = req.params.targetId;
    const targetType = req.params.targetType; // "Question" or "Answer"
    const userId = req.user.id;

    const result = await likeService.like({ userId, targetId, targetType });

    res.status(StatusCodes.CREATED).json({
      message: `Liked ${targetType.toLowerCase()} successfully.`,
      success: true,
      error: false,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function dislike(req, res, next) {
  try {
    const targetId = req.params.targetId;
    const targetType = req.params.targetType;
    const userId = req.user.id;

    const result = await likeService.disLike({ userId, targetId, targetType });

    res.status(StatusCodes.CREATED).json({
      message: `Disliked ${targetType.toLowerCase()} successfully.`,
      success: true,
      error: false,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  like,
  dislike,
};
