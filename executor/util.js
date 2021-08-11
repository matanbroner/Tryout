const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;

const User = require("./db/models/user");

// Generate a secret key
const generateSecretKey = function () {
  return crypto.randomBytes(64).toString("hex");
};

// Hash a password
const hashPassword = async function (password) {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

// Check if a password is valid
const validatePassword = async function (password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err || !result) {
        reject(err);
      } else {
        resolve(result);
      }
    });
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
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtKey,
      { expiresIn },
      { algorithm: "HS256" },
      (err, token) => {
        if (err) {
          return reject(err);
        } else {
          resolve({
            token,
            expiresIn,
          });
        }
      }
    );
  });
};

// Validate a JWT token
const validateJwt = async function (token) {
  const payload = jwt.decode(token);
  const { _id } = payload;
  const user = await User.findById(_id).exec();
  if (!user) {
    return Promise.reject("User ID in signed payload is invalid");
  }
  const { jwtKey } = user;
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Validate an email address
const validateEmail = function (email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

// Generate a UUID
const generateUuid = function (length = 8) {
  let id = uuidv4().substring(0, length);
  // add letter to uuid to allow class names to be uuid
  // TODO: make letter random
  return "z" + id;
};

module.exports = {
  generateJwt,
  generateSecretKey,
  generateJwt,
  generateUuid,
  hashPassword,
  validateEmail,
  validateJwt,
  validatePassword,
};
