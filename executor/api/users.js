const express = require("express");
const router = express.Router();
const User = require("../db/models/user");
const {
  generateSecretKey,
  hashPassword,
  validatePassword,
  validateEmail,
} = require("../util");

// create a get route for users
router.get("/", (req, res) => {
  res.json({
    message: "Hello from Users API",
  });
});

// register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Email is invalid, check format",
      });
    }
    // Create a password hash
    const passwordHash = await hashPassword(password);
    // Create new user's secret key
    const jwtKey = await generateSecretKey();
    // create a new user
    const newUser = {
      email,
      jwtKey,
      password: passwordHash,
    };

    // save the new user
    const savedUser = await users.save(newUser);

    // return the saved user
    res.json(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});
