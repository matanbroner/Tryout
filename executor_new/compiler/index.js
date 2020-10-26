const fs = require("fs").promises;
const path = require("path");
const uril = require("./util");
const { CompilerExecution } = require("./core_objects");
const util = require("./util");

class Compiler {
  async runCode(code, language, callback, settings = {}) {
    const filePath = await this.generateBuildFile(code, language);
    const modCallback = this.generateExecutionCallback(filePath, callback);
    return new CompilerExecution(filePath, language, modCallback, settings);
  }

  async generateBuildFile(code, language) {
    const fileId = util.all.uuid();
    const suffix = this.fileSuffix(language);
    const filePath = await path.resolve(
      __dirname,
      `builds/${fileId}.${suffix}`
    );
    code = this.formatPreBuild(language, code, fileId);
    const err = await fs.writeFile(filePath, code);
    if (err) {
      console.log(err);
    }
    return filePath;
  }

  generateExecutionCallback(filePath, callback) {
    const execCallback = (output, errors) => {
      fs.unlink(filePath);
      callback(output, errors);
    };
    return execCallback;
  }

  formatPreBuild(language, code, fileId) {
    switch (language) {
      case "java":
        return util.java.mainClassRefactor(code, fileId);
      default:
        return code;
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
