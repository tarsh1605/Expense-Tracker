const express=require('express')
const userRouter=express.Router();
const {userSignIn,userLogin,userLogout,tokenRefresh}=require('../controller/user.controller.js')

userRouter.route("/signup").post(userSignIn)
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(userLogout)
userRouter.route("/token").post(tokenRefresh)
module.exports=userRouter;