const uuidv4 = require("uuid").v4;
const fs = require("fs");
const path = require("path");

module.exports = {
  all: {
    uuid: (length = 8) => {
      let id = uuidv4().substring(0, length);
      // add letter to uuid to allow class names to be uuid
      // TODO: make letter random
      return "z" + id;
    },
  },
  java: {
    formatPreBuild: (code, fileId) => {
      return {
        code: code.replace("Solution", `Solution${fileId}`),
        fileId: `Solution${fileId}`,
      };
    },
    cleanPostBuild: (stdout, stderr, fileId) => {
      if (stderr.length == 0) {
        fs.unlink(path.resolve(__dirname, "builds", `${fileId}.class`), (err) => {
          console.log(err);
          return;
        });
      }
    },
  },
};
