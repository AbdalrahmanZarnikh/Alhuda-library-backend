const express=require("express");

const {Signup,Login,ForgotPassword,VerifyResetCode,ResetPassword}=require("../controllers/authController")


const {signupValidator}= require("../utils/validators/authValidator")

const router=express.Router()

router.post("/signup",signupValidator,Signup);

router.post("/login",Login);

router.post("/forgotPassword",ForgotPassword);

router.post("/verifyResetCode",VerifyResetCode);

router.put("/resetPassword",ResetPassword);


module.exports=router