const mongoose = require("mongoose");

const { Types } = mongoose.Schema;

const schema = new mongoose.Schema({
  firstName: Types.String,
  lastName: Types.String,
  email: Types.String,
  password: Types.String,
  confirmed: Types.Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', schema)
