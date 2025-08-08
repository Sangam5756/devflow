class FeedService {
  constructor(QuestionRepository, LikesRepository) {
    this.questionRepository = QuestionRepository;
    this.likesRepository = LikesRepository;
  }

  async getPublicFeed(limit = 20) {
    const questions = await this.questionRepository.getPublicQuestions(limit);

    const enrichedQuestions = await Promise.all(
      questions.map(async (question) => {
        const [likes, dislikes] = await Promise.all([
          this.likesRepository.countLikes(question._id, "Question"),
          this.likesRepository.countDislikes(question._id, "Question"),
        ]);

        return {
          ...question,
          likes,
          dislikes,
        };
      }),
    );

    return enrichedQuestions;
  }
}

module.exports = FeedService;
