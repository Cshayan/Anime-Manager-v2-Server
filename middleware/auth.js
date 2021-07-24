/* Auth middleware to verify token and make private routes */

const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('./asyncHandler')
const User = require('../model/User')

const makeRoutePublicAndPrivate = (url) => {
  if (url.includes('/anime-details/')) return true
}

exports.protect = asyncHandler(async (req, res, next) => {
  const headerToken = req.headers.authorization

  if (!headerToken && !makeRoutePublicAndPrivate(req.url)) {
    return next(
      new ErrorResponse('You are not logged in to your account.', 401)
    )
  }

  if (!makeRoutePublicAndPrivate(req.url)) {
    // Verify token
    try {
      const decodedToken = jwt.verify(headerToken, process.env.JWT_SECRET)
      req.user = await User.findById(decodedToken.id)
      next()
    } catch (error) {
      return next(
        new ErrorResponse('You are not logged in to your account.', 401)
      )
    }
  } else {
    next()
  }
})
