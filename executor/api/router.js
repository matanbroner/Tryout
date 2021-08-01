const express = require('express');
const usersRouter = require('./user');
const tryoutRouter = require('./tryout');

const router = express.Router();

router.use('/user', usersRouter);
router.use('/tryout', tryoutRouter);

module.exports = router;