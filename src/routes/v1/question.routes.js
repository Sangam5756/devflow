const express = require("express");
const { QuestionController } = require("../../controller");
const AuthMiddleware = require("../../middleware/authMiddleware");
const optionalAuthMiddleware = require("../../middleware/optionalAuthMiddleware");

const questionRouter = express.Router();

/**
 * @swagger
 * /question/:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 
 *     responses:
 *       200:
 *         description: List of questions retrieved successfully
 *         content:
 *           application/json:
 *     security:
 *       - bearerAuth: []
 */
questionRouter.get("/", AuthMiddleware, QuestionController.getQuestions);

/**
 * @swagger
 * /question/{id}:
 *   get:
 *     summary: Get a single question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Question ID
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *       - in: header
 *         name: Authorization
 *         required: false

 *            
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85e"
 *                 title:
 *                   type: string
 *                   example: "How to setup Node.js with Swagger?"
 *                 content:
 *                   type: string
 *                   example: "I want to document my APIs using Swagger in Node.js."
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                 likes:
 *                   type: integer
 *                   example: 5
 *                 answer:
 *                   type: integer
 *                   example: 2
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-10T12:34:56Z"
 *                 isLiked:
 *                   type: boolean
 *                   example: true
 *                 isOwner:
 *                   type: boolean
 *                   example: false
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64dcd5aad913a7fbb2dce85f"
 *                       content:
 *                         type: string
 *                         example: "You can use swagger-jsdoc with express."
 *                       author:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Jane Smith"
 *                           username:
 *                             type: string
 *                             example: "janesmith"
 *                       likes:
 *                         type: integer
 *                         example: 3
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-10T13:00:00Z"
 *                       isLiked:
 *                         type: boolean
 *                         example: false
 *                       isOwner:
 *                         type: boolean
 *                         example: true
 *       404:
 *         description: Question not found
 */
questionRouter.get(
  "/:id",
  optionalAuthMiddleware,
  QuestionController.getQuestion,
);

/**
 * @swagger
 * /question:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Question object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: "How to setup Node.js with Swagger?"
 *               body:
 *                 type: string
 *                 example: "I want to document my APIs using Swagger in Node.js."
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nodejs", "swagger", "documentation"]
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85e"
 *                 title:
 *                   type: string
 *                   example: "How to setup Node.js with Swagger?"
 *                 content:
 *                   type: string
 *                   example: "I want to document my APIs using Swagger in Node.js."
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                 likes:
 *                   type: integer
 *                   example: 0
 *                 answer:
 *                   type: integer
 *                   example: 0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-10T12:34:56Z"
 *       400:
 *         description: Validation error
 */
questionRouter.post("/", AuthMiddleware, QuestionController.createQuestion);

/**
 * @swagger
 * /question/{id}:
 *   put:
 *     summary: Update an existing question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Question ID to update
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     requestBody:
 *       description: Fields to update for the question
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated title"
 *               body:
 *                 type: string
 *                 example: "Updated content of the question."
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["express", "swagger"]
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64dcd4f8d913a7fbb2dce85e"
 *                 title:
 *                   type: string
 *                   example: "Updated title"
 *                 content:
 *                   type: string
 *                   example: "Updated content of the question."
 *                 topics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "express"
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized
 */
questionRouter.put("/:id", AuthMiddleware, QuestionController.updateQuestion);

/**
 * @swagger
 * /question/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Question ID to delete
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dcd4f8d913a7fbb2dce85e"
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */
questionRouter.delete(
  "/:id",
  AuthMiddleware,
  QuestionController.deleteQuestion,
);

module.exports = questionRouter;
