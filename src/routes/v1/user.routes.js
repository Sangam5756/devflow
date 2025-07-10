const express = require("express");
const { userController } = require("../../controller");



const userRouter = express.Router();

userRouter.get("/:username",userController.getUser);
userRouter.put("/",userController.updateUser);
userRouter.post("/register",userController.register); 
userRouter.post("/login",userController.login);


module.exports = userRouter;