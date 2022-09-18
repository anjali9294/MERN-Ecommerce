const ErrorHandlar = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

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

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandlar("User Not Found", 404));
  }

  // get resetpassword token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `message send to ${user.email}  successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandlar(error.message, 500));
  }
});
