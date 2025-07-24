const express = require('express');
const { userController } = require('../../controller');
const authMiddleware = require('../../middleware/authMiddleware');

const userRouter = express.Router();

userRouter.get('/verify', authMiddleware, userController.sendEmailOtp);
userRouter.post('/verify', authMiddleware, userController.verifyEmailOtp);
userRouter.get('/:username', userController.getUser);

userRouter.put('/update', authMiddleware,  userController.updateUser);
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

module.exports = userRouter;
