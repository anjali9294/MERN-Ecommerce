const ErrorHandlar = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");

// register User
module.exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, password, email } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample public id",
      url: "avatar url",
    },
  });

  sendToken(user, 201, res);
});

// Login User
module.exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //   checking if user has given email and password both
  if (!email || !password) {
    return next(new ErrorHandlar("Please Enter Email & Password", 401));
  }
  const user = await User.findOne({ email }).select("+password");
  // if user not found
  if (!user) {
    return next(new ErrorHandlar("Invalid Email or Password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  // if password is not matched
  if (!isPasswordMatched) {
    return next(new ErrorHandlar("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// Logout user

exports.LogOutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out succsesfully",
  });
});
