const mongoose = require("mongoose");

const { Types } = mongoose.Schema;

const schema = new mongoose.Schema({
  firstName: Types.String,
  lastName: Types.String,
  email: {
    type: Types.String,
    required: true,
  },
  password: {
    type: Types.String,
    required: true,
  },
  jwtKey: {
    type: Types.String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", schema);
