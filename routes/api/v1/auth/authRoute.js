/* Authentication route for users */

const express = require("express");
const router = express.Router();

// Controller Methods
const {
  registerUser,
  loginUser,
  getMe,
} = require("../../../../controller/api/v1/auth/authController");

// Protect auth middleware
const { protect } = require("../../../../middleware/auth");

// Route to endpoints
router.route("/signUp").post(registerUser);
router.route("/signIn").post(loginUser);
router.route("/getMe").get(protect, getMe);

module.exports = router;
