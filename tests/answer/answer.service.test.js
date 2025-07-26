const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Answer = require("../../src/models/answer.model");
const Question = require("../../src/models/question.model");
const User = require("../../src/models/user.model");
const AnswerService = require("../../src/services/answer.service");
const AnswerRepository = require("../../src/repositories/answer.repository");

let mongo;
let answerService;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  answerService = new AnswerService(AnswerRepository);
});

afterEach(async () => {
  await Answer.deleteMany();
  await Question.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("AnswerService", () => {
  it("should create a top-level answer", async () => {
    const user = await User.create({
      username: "Alice",
      email: "alice@test.com",
      password: "test123",
    });

    const question = await Question.create({
      title: "Q1",
      body: "What is AI?",
      userId: user._id,
    });

    const result = await answerService.createAnswer({
      id: user._id,
      questionId: question._id,
      answer: "Artificial Intelligence is the simulation of human intelligence.",
      parentAnswerId: null,
    });

    expect(result).toBeDefined();
    expect(result.answer).toBe("Artificial Intelligence is the simulation of human intelligence.");
    expect(result.parentAnswerId).toBe(null);
  });

  it("should create a reply to an existing answer", async () => {
    const user = await User.create({
      username: "bob",
      email: "bob@test.com",
      password: "test123",
    });

    const question = await Question.create({
      title: "Q2",
      body: "Explain ML",
      userId: user._id,
    });

    const parentAnswer = await Answer.create({
      userId: user._id,
      questionId: question._id,
      answer: "ML is a subset of AI.",
    });

    const reply = await answerService.createAnswer({
      id: user._id,
      questionId: question._id,
      answer: "Yes, and it involves algorithms.",
      parentAnswerId: parentAnswer._id,
    });

    expect(reply.parentAnswerId.toString()).toBe(parentAnswer._id.toString());
  });

  it("should get answer by ID", async () => {
    const user = await User.create({
      username: "carol",
      email: "carol@test.com",
      password: "test123",
    });

    const question = await Question.create({
      title: "Q3",
      body: "Explain DL",
      userId: user._id,
    });

    const answer = await Answer.create({
      userId: user._id,
      questionId: question._id,
      answer: "DL uses neural networks.",
    });

    const found = await answerService.getAnswerById(answer._id);
    expect(found.answer).toBe("DL uses neural networks.");
  });

  it("should throw NotFound when answer does not exist", async () => {
    await expect(
      answerService.getAnswerById(new mongoose.Types.ObjectId())
    ).rejects.toThrow("answer with");
  });

  it("should return all answers for a question", async () => {
    const user = await User.create({
      username: "dave",
      email: "dave@test.com",
      password: "test123",
    });

    const question = await Question.create({
      title: "Q4",
      body: "Explain ChatGPT",
      userId: user._id,
    });

    await Answer.create([
      {
        userId: user._id,
        questionId: question._id,
        answer: "It's an AI chatbot.",
      },
      {
        userId: user._id,
        questionId: question._id,
        answer: "It uses GPT models.",
      },
    ]);

    const answers = await answerService.getAnswerbyQuestion({questionId: question._id,parentAnswerId: null});
    expect(answers.length).toBe(2);
  });

  it("should delete an answer with correct user", async () => {
    const user = await User.create({
      username: "eve",
      email: "eve@test.com",
      password: "test123",
    });

    const question = await Question.create({
      title: "Q5",
      body: "Explain tokens",
      userId: user._id,
    });

    const answer = await Answer.create({
      userId: user._id,
      questionId: question._id,
      answer: "A token is a unit of text.",
    });

    const deleted = await answerService.deleteAnswer({
      id: user._id,
      answerId: answer._id,
    });

    expect(deleted._id.toString()).toBe(answer._id.toString());
    const stillThere = await Answer.findById(answer._id);
    expect(stillThere).toBeNull();
  });

  it("should not delete if user is not the owner", async () => {
    const user1 = await User.create({
      username: "frank",
      email: "f@test.com",
      password: "test123",
    });
    const user2 = await User.create({
      username: "george",
      email: "g@test.com",
      password: "test123",
    });

    const question = await Question.create({
      title: "Q6",
      body: "Who owns data?",
      userId: user1._id,
    });

    const answer = await Answer.create({
      userId: user1._id,
      questionId: question._id,
      answer: "Data ownership is complex.",
    });

    await expect(
      answerService.deleteAnswer({
        id: user2._id,
        answerId: answer._id,
      })
    ).rejects.toThrow("Not authorized");
  });
});
