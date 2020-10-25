/* Custom middleware for error handling - to prevent server crashing */

const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Handle Cast Error
  if (err.name === "CastError") {
    const message = `Resource not found with ID ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Duplicate feild value
  if (err.code === 11000) {
    const message = "The anime is already added to your watchlist";
    error = new ErrorResponse(message, 400);
  }

  // Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Send Response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
