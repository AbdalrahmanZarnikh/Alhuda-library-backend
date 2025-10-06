const asyncHandler = require("express-async-handler");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const SendEmail = require("../utils/SendEmail");

const UserModel = require("../models/userModel");

const ApiError = require("../utils/ApiError");
const createToken = require("../utils/CreateToken");

const bcrypt = require("bcryptjs");

// public
exports.Signup = asyncHandler(async (req, res) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = createToken(user._id);

  res.status(201).json({
    status: "Success",
    data: user,
    token,
  });
});

// public

exports.Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const token = createToken(user._id);
  res.status(200).json({ status: "Success", data: user, token });
});

// protected

exports.Protect = asyncHandler(async (req, res, next) => {
  // 1)check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("your not login !! please login to access this route"),
      401
    );
  }

  // 2) verify token
  const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

  // 3) check if user exists
  const currentUser = await UserModel.findOne({ _id: decoded.userId });

  if (!currentUser) {
    return next(
      new ApiError(
        "user not found for this token , you need to login again ",
        401
      )
    );
  }

  // 4) check if user changed his password
  if (currentUser.changedPasswordAt) {
    const timestampsChangedPassword = parseInt(
      currentUser.changedPasswordAt.getTime() / 1000,
      10
    );

    if (timestampsChangedPassword > decoded.iat) {
      return next(
        new ApiError("user changed password , please login again ", 401)
      );
    }
  }

  req.user = currentUser;

  next();
});

// @desc middleware for allowed users to other routes

exports.Allowed = (...roles) => {
  return asyncHandler(async (req, res, next) => {
   
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access for this route ", 403)
      );
    }
    next();
  });
};

exports.ForgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`user not found for this email ${req.body.email}`),
      404
    );
  }

  const secret = "abcdefg";

  const passwordResetCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const hashedPasswordResetCode = crypto
    .createHmac("sha256", secret)
    .update(passwordResetCode)
    .digest("hex");

  user.passwordResetCode = hashedPasswordResetCode;

  user.passwordResetCodeVerify = false;
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  //send PasswordResetCode to email user

  try {
    await SendEmail({
      email: user.email,
      subject: "password reset code valid for 10 minutes",
      message:`you'r password reset code is \n ${passwordResetCode} \n thanks Team E-shop\n`,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeVerify = undefined;
    user.passwordResetCodeExpires = undefined;
    await user.save();
    return next(new ApiError("Error sending email , try again later",500))
  }
  
  res.status(200).json({status:"Success",message:"password reset code sent to you'r email"})
});

// @desc this controller for reset code 

exports.VerifyResetCode=asyncHandler(async(req,res,next)=>{
    const secret="abcdefg";
    const hashedPasswordResetCode=crypto.createHmac("sha256",secret).update(req.body.resetCode).digest("hex");

    const user=await UserModel.findOne({passwordResetCode:hashedPasswordResetCode,passwordResetCodeExpires:{$gt:Date.now()}});

    if(!user){
        return next(new ApiError("password reset code is invalid or expired"))
    }

    user.passwordResetCodeVerify=true;

    await user.save();

    res.status(200).json({status:"Success"})
})

// @desc Reset Password After Reset Code Verify Success

exports.ResetPassword=asyncHandler(async(req,res,next)=>{
    const user = await UserModel.findOne({email:req.body.email});


    if(!user){
        return next(new ApiError("user not found ",404));
    }

    if(!user.passwordResetCodeVerify){
        return next(new ApiError("reset code not verified",400))
    }

    user.password=req.body.newPassword;
    user.passwordResetCodeVerify=undefined;
    user.passwordResetCodeExpires=undefined;
    user.passwordResetCode=undefined;

    await user.save();

    const token =createToken(user._id);

    res.status(200).json({status:"Success",data:user,token})
})