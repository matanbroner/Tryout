const mongoose = require("mongoose");
const roles = require("../assets/roles");

const { Types } = mongoose.Schema;

const schema = new mongoose.Schema({
  name: Types.String,
  tryoutId: {
    type: Types.ObjectId,
    index: true,
    unique: true
  },
  creatorId: { type: Types.ObjectId, index: true },
  sharedUsers: [
    {
      userId: Types.ObjectId,
      role: {
        type: Types.String,
        default: roles.WRITER,
      },
    },
  ],
  files: [Types.String],
  language: Types.String,
  statistics: {
    compileCount: Types.Number,
  },
  createdAt: {
    type: Types.Date,
    default: Date.now,
  },
  updatedAt: {
    type: Types.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tryout", schema);
