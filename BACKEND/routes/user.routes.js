const express=require('express')
const userRouter=express.Router();
const {userSignIn,userLogin,userLogout}=require('../controller/user.controller.js')

userRouter.route("/signup").post(userSignIn)
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(userLogout)
module.exports=userRouter;