/* Controller file for handling authentication of users */

const ErrorResponse = require("../../../../utils/ErrorResponse");
const asyncHandler = require("../../../../middleware/asyncHandler");

const User = require("../../../../model/User");

// Utils
const sendEmail = require("../../../../utils/sendEmail");
const randomstring = require("randomstring");

/*
 * POST /api/v1/auth/signUp
 * Access - Public
 * Desc - Register a new user
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;

  // check if the user has already registered wuth same email
  const user = await User.findOne({ email }).select("+password");

  if (user) {
    return next(
      new ErrorResponse(
        "You have already registered with the same email address.",
        401
      )
    );
  }

  // generate a token for that email
  const tokenToVerify = randomstring.generate(7);

  // Email options
  const options = {
    email: email ? email : "",
    subject: "AnimeManager - Verify your account",
    templateName: "verify-account.html",
  };

  // Generate link to verify account in frontend
  const verifyAccountLink =
    process.env.NODE_ENV == "production"
      ? `https://anime-manager-v2.netlify.app/verify-account/?email=${email}&token=${tokenToVerify}`
      : `http://localhost:3000/verify-account/?email=${email}&token=${tokenToVerify}`;

  // data needs to be send to email after registering
  const dataToSend = { uniqueCode: tokenToVerify, verifyAccountLink, name };

  // insert the token to request body
  req.body.verifiedToken = tokenToVerify;

  // send email on registering
  sendEmail(options, dataToSend);

  // save the user to DB
  await User.create(req.body);

  // send response
  res.status(201).json({
    success: true,
    message:
      "Registered successfully! Please check your mail and verify the account",
  });
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

  // check if the account is verified
  if (!user.isVerified) {
    return next(new ErrorResponse("Verify your account to log in.", 401));
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

/*
 *  POST api/v1/auth/verify-account
 *  Purpose:- Verifies the account
 *  Access:- Public
 */
exports.verifyAccount = asyncHandler(async (req, res, next) => {
  const { email, token } = req.body;

  // find the user by email
  if (!email) {
    return next(new ErrorResponse("Please provide email to verify.", 400));
  }

  // check if user exists with the email
  const user = await User.findOne({
    email,
  });

  // if user is not present
  if (!user) {
    return next(new ErrorResponse("No user present with email.", 401));
  }

  // if the user is already verified
  if (user.isVerified) {
    return next(
      new ErrorResponse(
        "Your account is already verified. Log in to your account",
        401
      )
    );
  }

  // if the token matches
  if (user.verifiedToken === token) {
    user.isVerified = true; // make the user verified
    user.verifiedToken = null; // set the verified token field to null
    await user.save(); // update the DB
    res.status(200).json({
      success: true,
      message: "Your account is now verified. Please log in to your account.",
    });
  } else {
    return next(new ErrorResponse("Please provide a valid token.", 401));
  }
});

// Send Response with token
const sendToken = (user, statusCode, res) => {
  const token = user.generateJWT();

  res.status(statusCode).json({
    success: true,
    token,
  });
};
