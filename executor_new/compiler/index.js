const fs = require("fs").promises;
const path = require("path");
const uril = require("./util");
const { CompilerExecution } = require("./core_objects");
const util = require("./util");

class Compiler {
  async runCode(code, language, callback, settings = {}) {
    const {
      fileId,
      filePath
    } = await this.generateBuildFile(code, language);
    const modCallback = this.generateExecutionCallback(
      filePath,
      language,
      fileId,
      callback
    );
    return new CompilerExecution(filePath, language, modCallback, settings);
  }

  async generateBuildFile(code, language) {
    let fileId = util.all.uuid();
    const modifiedBuild = this.formatPreBuild(language, code, fileId);
    code = modifiedBuild.code;
    fileId = modifiedBuild.fileId;
    const suffix = this.fileSuffix(language);
    const filePath = await path.resolve(
      __dirname,
      `builds/${fileId}.${suffix}`
    );
    const err = await fs.writeFile(filePath, code);
    if (err) {
      console.log(err);
    }
    return {
      fileId,
      filePath
    };
  }

  generateExecutionCallback(filePath, language, fileId, callback) {
    const execCallback = function(output, errors){
      fs.unlink(filePath);
      this.cleanPostBuild(language)(output, errors, fileId);
      callback(output, errors);
    }.bind(this);
    return execCallback;
  }

  formatPreBuild(language, code, fileId) {
    switch (language) {
      case "java":
        return util.java.formatPreBuild(code, fileId);
      default:
        return {
          code,
          fileId,
        };
    }
  }

  cleanPostBuild(language) {
    switch (language) {
      case "java":
        return util.java.cleanPostBuild;
      default:
        return function() { return };
    }
  }

  fileSuffix(language) {
    switch (language) {
      case "python":
        return "py";
      case "javascript":
        return "js";
      case "java":
        return "java";
    }
  }
}

module.exports = {
  Compiler,
};
