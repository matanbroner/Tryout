const express = require('express');
const router = express.Router();
const User = require('../db/models/user');

// create a get route for users
router.get('/', (req, res) => {
  res.json({
    message: 'Hello from Users API'
  });
}
);

// register a new user
router.post('/register', (req, res) => {

  // create a new user
  const newUser = {
    email: req.body.email,
    password: req.body.password
  };

  // save the new user
  const savedUser = users.save(newUser);

  // return the saved user
  res.json(savedUser);
}
);



