/* Controller file for handling authentication of users */

const ErrorResponse = require("../../../../utils/ErrorResponse");
const asyncHandler = require("../../../../middleware/asyncHandler");

const User = require("../../../../model/User");

/*
 * POST /api/v1/auth/signUp
 * Access - Public
 * Desc - Register a new user
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  sendToken(user, 200, res);
});

/*
 * POST /api/v1/auth/signIn
 * Access - Public
 * Desc - Logins an existing user
 */
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse(
        "Plase provide email and passowrd. Both are required",
        400
      )
    );
  }

  // find the user with the provided email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials provided", 401));
  }

  // match the password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentails provided", 400));
  }

  sendToken(user, 200, res);
});

/*
 * GET /api/v1/auth/getMe
 * Access - Private
 * Desc - Gets the info of currently logged in user
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Send Response with token
const sendToken = (user, statusCode, res) => {
  const token = user.generateJWT();

  res.status(statusCode).json({
    success: true,
    token,
  });
};
