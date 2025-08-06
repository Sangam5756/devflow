const mongoose = require("mongoose");
const BadRequestError = require("../error/badrequest.error");
const NotFound = require("../error/notfound.error");

class LikeDislikeService {
  constructor(LikeDislikeRepository, QuestionRepository, AnswerRepository) {
    this.likeDislikeRepository = LikeDislikeRepository;
    this.questionRepository = QuestionRepository;
    this.answerRepository = AnswerRepository;
  }

  /**
   * Validates the existence of a target entity (Question or Answer) by its ID and type.
   * Throws a NotFoundError if the target does not exist, or a BadRequestError if the target type is invalid.
   *
   * @async
   * @param {string} targetId - The ID of the target entity to validate.
   * @param {string} targetType - The type of the target entity ("Question" or "Answer").
   * @throws {NotFoundError} If the target entity does not exist.
   * @throws {BadRequestError} If the target type is invalid.
   * @returns {Promise<void>}
   */

  async validateTargetExistence(targetId, target_type) {
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      throw new BadRequestError("Invalid target ID.");
    }

    let model;

    switch (target_type) {
      case "Question":
        model = this.questionRepository;
        break;
      case "Answer":
        model = this.answerRepository;
        break;
      default:
        throw new BadRequestError("Invalid target type.");
    }

    const target = await model.findById(targetId);

    if (!target) {
      throw new NotFound(`${target_type} not found.`);
    }
  }

  async like({ userId, targetId, targetType }) {
    await this.validateTargetExistence(targetId, targetType);

    const existingLike = await this.likeDislikeRepository.findOne({
      userId: userId,
      targetId: targetId,
      target_type: targetType,
    });

    if (existingLike && existingLike.type === "like") {
      throw new BadRequestError("Already liked this content.");
    }

    if (existingLike && existingLike.type === "dislike") {
      const like = await this.likeDislikeRepository.update(existingLike._id, {
        type: "like",
      });

      return like;
    }

    const like = await this.likeDislikeRepository.create({
      userId,
      targetId,
      target_type: targetType,
      type: "like",
    });

    return like;
  }

  /**
   * Registers a dislike action by a user on a specified target (e.g., post, comment).
   *
   * - Validates the existence of the target.
   * - If the user has already disliked the target, throws an error.
   * - If the user previously liked the target, updates the like to a dislike.
   * - Otherwise, creates a new dislike entry.
   *
   * @async
   * @param {Object} params - The parameters for the dislike action.
   * @param {string} params.userId - The ID of the user performing the dislike.
   * @param {string} params.targetId - The ID of the target to be disliked.
   * @param {string} params.targetType - The type of the target (e.g., 'post', 'comment').
   * @returns {Promise<Object>} The created or updated dislike record.
   * @throws {BadRequestError} If the user has already disliked the target.
   */
  async disLike({ userId, targetId, targetType }) {
    await this.validateTargetExistence(targetId, targetType);

    const existingDislike = await this.likeDislikeRepository.findOne({
      userId,
      targetId,
      target_type: targetType,
    });

    if (existingDislike && existingDislike.type === "dislike") {
      throw new BadRequestError("Already disliked this content.");
    }

    if (existingDislike && existingDislike.type === "like") {
      // Update to dislike if previously liked
      const updated = await this.likeDislikeRepository.update(
        existingDislike._id,
        {
          type: "dislike",
        },
      );

      return updated;
    }
    const dislike = await this.likeDislikeRepository.create({
      userId,
      targetId,
      target_type: targetType,
      type: "dislike",
    });

    return dislike;
  }
}

module.exports = LikeDislikeService;
