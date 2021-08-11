const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../db/models/user");
const {
  generateJwt,
  generateSecretKey,
  hashPassword,
  validatePassword,
  validateEmail,
} = require("../util");
const { ApiError } = require("./errors");

const { authMiddleware, adminMiddleware } = require("./middleware");

// fetch all users (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).exec();
    return res.status(200).json({
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate request body
    if (!email || !password) {
      throw new ApiError("Email and password are required to register", 400);
    }
    // Validate email
    if (!validateEmail(email)) {
      throw new ApiError("Invalid email", 400);
    }
    // Check if user already exists
    const user = await User.findOne({ email }).exec();
    if (user) {
      throw new ApiError("Email already in use", 400);
    }
    // Create a password hash
    const passwordHash = await hashPassword(password);
    console.log(passwordHash);
    // Create new user's secret key
    const jwtKey = await generateSecretKey();
    // create a new user
    const newUser = new User({
      email,
      jwtKey,
      password: passwordHash,
    });

    // save the new user
    const savedUser = await newUser.save();

    // return the saved user
    return res.json(savedUser);
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    } else {
      return res.status(500).json({
        error: err.message,
      });
    }
  }
});

// login a user
router.post("/login", async (req, res) => {
  const defaultError = "Invalid email-password combination";
  try {
    const { email, password } = req.body;
    // Validate request body
    if (!email || !password) {
      throw new ApiError("Email and password are required", 400);
    }
    // Validate email
    if (!validateEmail(email)) {
      throw new ApiError("Email is invalid, check format", 400);
    }
    // Fetch user with email
    const user = await User.findOne({
      where: { email },
    }).exec();
    if (!user) {
      throw new ApiError(defaultError, 401);
    }
    // Validate password
    await validatePassword(password, user.password);

    // Create a JWT token
    const accessKey = await generateJwt(user);

    // Return the token
    res.json({
      accessKey,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.status).json({
        message: err.message,
      });
    } else {
      res.status(400).json({
        error: defaultError,
      });
    }
  }
});

module.exports = router;
