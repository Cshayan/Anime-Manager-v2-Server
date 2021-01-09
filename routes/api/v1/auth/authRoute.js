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
  updateUserPassword,
  updateProfilePic,
  getSpecificUser,
} = require("../../../../controller/api/v1/auth/authController");

// Protect auth middleware
const { protect } = require("../../../../middleware/auth");

// Route to endpoints
router.route("/signUp").post(registerUser);
router.route("/signIn").post(loginUser);
router.route("/getMe").get(protect, getMe);
router.route("/getUser").post(getSpecificUser);
router.route("/verify-account").post(verifyAccount);
router.route("/forgot-password").put(forgotPassword);
router.route("/reset-password").put(resetPassword);
router.route("/update-password").put(protect, updateUserPassword);
router.route("/update-profile-pic").put(protect, updateProfilePic);

module.exports = router;
