const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./db/models/user");

// Generate a secret key
const generateSecretKey = function () {
  return crypto.randomBytes(64).toString("hex");
};

// Hash a password
const hashPassword = async function (password) {
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      return Promise.reject(err);
    } else {
      return Promise.resolve(hash);
    }
  });
};

// Check if a password is valid
const validatePassword = async function (password, hash) {
  bcrypt.compare(password, hash, function (err, result) {
    if (err || !result) {
      return Promise.reject(err);
    } else {
      return Promise.resolve(result);
    }
  });
};

// Generate a JWT token
const generateJwt = function (user) {
  const expiresIn = process.env.JWT_EXPIRES || "7d";
  const { _id, email, name, role, jwtKey } = user;
  const payload = {
    _id,
    email,
    name,
    role,
  };
  return jwt.sign(
    payload,
    jwtKey,
    { expiresIn },
    { algorithm: "HS256" },
    (err, token) => {
      if (err) {
        return Promise.reject(err);
      } else {
        return Promise.resolve(token);
      }
    }
  );
};

// Validate a JWT token
const validateJwt = async function (token) {
  const payload = jwt.decode(token);
  const { _id } = payload;
  const user = await User.findById(_id);
  if (!user) {
    return Promise.reject("User ID in signed payload is invalid");
  }
  const { jwtKey } = user;
  return jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return Promise.reject(err);
    } else {
      return Promise.resolve(decoded);
    }
  });
};

// Validate an email address
const validateEmail = function (email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

module.exports = {
  generateJwt,
  generateSecretKey,
  generateToken,
  hashPassword,
  validateEmail,
  validateJwt,
  validatePassword,
};
