class FeedService {
  constructor(QuestionRepository, LikesRepository, AnswerRepository) {
    this.questionRepository = QuestionRepository;
    this.likesRepository = LikesRepository;
    this.answerRepository = AnswerRepository;
  }

  async getPublicFeed(limit = 20, userId = null) {
    const questions = await this.questionRepository.getPublicQuestions(limit);
    console.log(userId);
    const enrichedQuestions = await Promise.all(
      questions.map(async (question) => {
        const [likes, dislikes, replies, isLike] = await Promise.all([
          this.likesRepository.countLikes(question._id, "Question"),
          this.likesRepository.countDislikes(question._id, "Question"),
          this.answerRepository.countAnswers({ questionId: question._id }),
          userId
            ? this.likesRepository.isUserLiked(question._id, "Question", userId)
            : false,
        ]);
        const isOwner =
          !!userId && question.userId?._id.toString() === userId.toString();

        return {
          ...question,
          likes,
          dislikes,
          replies,
          loggedIn: !!userId,
          isLike,
          isOwner,
        };
      }),
    );

    return enrichedQuestions;
  }
  async getPrivateFeed(limit = 20, _userId = null) {
    const questions = await this.questionRepository.getPublicQuestions(limit);

    return questions;
  }
}

module.exports = FeedService;
