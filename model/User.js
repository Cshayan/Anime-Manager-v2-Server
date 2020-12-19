/* Model for User */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name."],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add an email."],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password should be a minimum of 6 characters"],
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedToken: String,
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt the password before saving user details
UserSchema.pre("save", async function (next) {
  // Check if password is modified or not
  if (!this.isModified("password")) {
    next();
  }

  // generate salt
  const salt = await bcrypt.genSalt(10);

  // hash password
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token
UserSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Function to match the passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model
module.exports = mongoose.model("User", UserSchema);
