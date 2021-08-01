const User = require("../db/models/user");
const roles = require("../db/assets/roles");
const { validateJwt } = require("../util");

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
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      res.status(401).json({
        message: "No JWT provided",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

// Verify user role is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role === roles.ADMIN) {
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
