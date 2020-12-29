/* Authentication route for users */

const express = require("express");
const router = express.Router();

// Controller Methods
const {
  registerUser,
  loginUser,
  getMe,
  verifyAccount,
  forgotPassword,
  resetPassword,
} = require("../../../../controller/api/v1/auth/authController");

// Protect auth middleware
const { protect } = require("../../../../middleware/auth");

// Route to endpoints
router.route("/signUp").post(registerUser);
router.route("/signIn").post(loginUser);
router.route("/getMe").get(protect, getMe);
router.route("/verify-account").post(verifyAccount);
router.route("/forgot-password").put(forgotPassword);
router.route("/reset-password").put(resetPassword);

module.exports = router;
