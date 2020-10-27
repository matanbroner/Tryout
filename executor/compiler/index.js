const fs = require("fs").promises;
const path = require("path");
const util = require("./util");
const { CompilerExecution } = require("./core_objects");

class Compiler {
  /**
   * Initiates build and execution of given code
   * @param  {String} code
   * @param  {String} language
   * @param  {Function} callback - function accepting stdout and stderr
   * @param  {Object} settings
   * @returns {CompilerExecution} - timed execution of the given code
   */
  async runCode(code, language, callback, settings = {}) {
    const { fileId, filePath } = await this.generateBuildFile(code, language);
    const modCallback = this.generateExecutionCallback(
      filePath,
      language,
      fileId,
      callback
    );
    return new CompilerExecution(filePath, language, modCallback, settings);
  }

  /**
   * Generates a language dependent file with inputed code
   * @param  {String} code
   * @param  {String} language
   * @returns {Object} ID and path of generated code file
   */
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
      filePath,
    };
  }

  /**
   * Creates a decorated parent callback which handles compiler related tasks on execution complete
   * @param  {String} filePath
   * @param  {String} language
   * @param  {String} fileId
   * @param  {Function} callback
   * @returns {Function} modified callback
   */
  generateExecutionCallback(filePath, language, fileId, callback) {
    const execCallback = function (output, errors) {
      fs.unlink(filePath);
      this.cleanPostBuild(language)(output, errors, fileId);
      callback(output, errors);
    }.bind(this);
    return execCallback;
  }

  /**
   * Applies language specific preformatting of code and build file
   * @param  {String} language
   * @param  {String} code
   * @param  {String} fileId
   * @returns {Object} modified code and file ID
   */
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

  /**
   * Applies language specific cleanup post execution complete
   * @param  {String} language
   * @returns {Function} cleanup utility function
   */
  cleanPostBuild(language) {
    switch (language) {
      case "java":
        return util.java.cleanPostBuild;
      default:
        return function () {
          return;
        };
    }
  }

  /**
   * Returns correct file suffix based on language
   * @param  {String} language
   * @returns {String} file suffix
   */
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
