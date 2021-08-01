const User = require('../db/models/user');
const roles = require("../db/assets/roles");

// write an express middleware to read a JWT token from the header and set it to the req.user
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        User.findOne({
            where: {
                token: token
            }
        }).then(user => {
            if (user) {
                req.user = user;
            }
            next();
        }).catch(err => {
            res.status(401).send(err);
        });
    } else {
        res.status(401).send('No token provided');
    }
};

// write an express middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role === roles.ADMIN) {
    next();
  } else {
    res.status(403);
  }
};

module.exports = {
  adminMiddleware
}