const User = require("../db/models/user");
const roles = require("../db/assets/roles");
const { validateJwt } = require("../util");
const { ApiError } = require("./errors");

// Check for valid JWT token header and decode it
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const decoded = await validateJwt(token);
      const user = await User.findById(decoded._id);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new ApiError("Unauthorized", 403);
      }
    } else {
      throw new ApiError("No access key provided", 401);
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.status).json({
        error: err.message,
      });
    } else {
      return res.status(500).json({
        error: err.message,
      });
    }
  }
};

// Verify user role is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role === roles.ADMIN) {
    next();
  } else {
    return res.status(403).json({
      error: "Unauthorized",
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
