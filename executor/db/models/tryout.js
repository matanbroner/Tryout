const mongoose = require("mongoose");
const roles = require("../assets/roles");

const { Types } = mongoose.Schema;

const schema = new mongoose.Schema({
  name: Types.String,
  creatorId: Types.ObjectId,
  sharedUsers: [{
      userId: Types.ObjectId,
      role: {
          type: Types.String,
          default: roles.WRITER
      }
  }],
  fileIds: [Types.String],
  language: Types.String,
  statistics: {
    compileCount: Types.Number,
  },
});

module.exports = mongoose.model('Tryout', schema)
