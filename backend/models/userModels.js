const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your  Name"],
    maxLength: [30, "Name cannot exeeded more then 30 charector"],
    minLength: [4, "Name should have more then 4 charector"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your  Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    select: false,
    minLength: [
      8,
      "Your password should have more then or equal to 8 charectors",
    ],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// hashing password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// generating password token
userSchema.methods.getResetPasswordToken = function () {
  // generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //  hashing and add to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("user", userSchema, "users");
