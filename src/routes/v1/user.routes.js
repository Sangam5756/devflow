const express = require("express");
const { userController } = require("../../controller");
const authMiddleware = require("../../middleware/authMiddleware");
const optionalAuthMiddleware = require("../../middleware/optionalAuthMiddleware");

const userRouter = express.Router();

/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Send email OTP for verification
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/verify", authMiddleware, userController.sendEmailOtp);

/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: Verify email OTP
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP
 *       401:
 *         description: Unauthorized
 */
userRouter.post("/verify", authMiddleware, userController.verifyEmailOtp);

/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get user details by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: User details retrieved
 *       404:
 *         description: User not found
 */
userRouter.get("/:username", optionalAuthMiddleware, userController.getUser);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.put("/update", authMiddleware, userController.updateUser);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
userRouter.post("/register", userController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", userController.login);

/**
 * @swagger
 * /user/oauth/login:
 *   post:
 *     summary: Login or register a user via OAuth (Google, GitHub, etc.)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - provider
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               provider:
 *                 type: string
 *                 enum: [google, github]
 *                 example: "google"
 *               bio:
 *                 type: string
 *                 example: "Full-stack dev"
 *     responses:
 *       200:
 *         description: OAuth login successful
 *       400:
 *         description: Missing required fields
 */
userRouter.post("/oauth/login", userController.oauthlogin);

module.exports = userRouter;
