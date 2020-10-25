/* Auth middleware to verify token and make private routes */

const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./asyncHandler");
const User = require("../model/User");

exports.protect = asyncHandler(async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next(
      new ErrorResponse("You are not logged in to your account.", 401)
    );
  }

  // Verify token
  try {
    const decodedToken = jwt.verify(headerToken, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    return next(
      new ErrorResponse("You are not logged in to your account.", 401)
    );
  }
});
