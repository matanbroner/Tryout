const fs = require("fs").promises;
const path = require("path");
const util = require("./util");
const { ContainerManager } = require("../container_manager");

class Compiler {
  constructor() {
    this.containerManager = new ContainerManager({});
  }
  /**
   * Initiates build and execution of given code
   * @param  {Array} files
   * @param  {String} language
   * @param  {Function} callback - function accepting stdout and stderr
   * @param  {Object} settings
   */
  async runCode(files, language, callback, settings = {}) {
    const { buildPath, compileId } = await this.generateBuildDir(
      files,
      language
    );
    const wrappedCallback = this.generateExecutionCallback(
      buildPath,
      compileId,
      callback
    );
    this.containerManager.run(language, buildPath, wrappedCallback);
  }

  /**
   * Generates a build directory for a compilation
   * @param   {Array} files - object holding each file's contents and name
   * @param   {String} language
   * @returns {Object} compilation ID and path of build
   */
  async generateBuildDir(files, language) {
    let compileId = util.all.uuid();
    const buildPath = path.join(__dirname, `builds/${compileId}`);
    try {
      await fs.mkdir(buildPath);
      let fileWritePromises = files.map((file) => {
        return fs.writeFile(
          path.join(buildPath, file.name),
          file.content,
          "utf-8"
        );
      });
      fileWritePromises.push(
        fs.copyFile(
          path.join(__dirname, `run_scripts/${language}.sh`),
          `${buildPath}/run.sh`
        )
      );
      await Promise.all(fileWritePromises);
    } catch (err) {
      console.error(err);
    }
    return {
      compileId,
      buildPath,
    };
  }

  /**
   * Creates a decorated parent callback which handles compiler related tasks on execution complete
   * @param  {String} buildPath
   * @param  {String} compileId
   * @param  {Function} callback
   * @returns {Function} modified callback
   */
  generateExecutionCallback(buildPath, compileId, callback) {
    const execCallback = async (stdout, stderr) => {
      await fs.rmdir(buildPath, { recursive: true });
      callback(stdout, stderr);
    };
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
}

module.exports = {
  Compiler,
};
