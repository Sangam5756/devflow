const express = require("express");
const { userController } = require("../../controller");



const userRouter = express.Router();

userRouter.get("/",userController.getUser);
userRouter.put("/",userController.updateUser);
userRouter.post("/signup",userController.register);
userRouter.post("/login",userController.login);


module.exports = userRouter;