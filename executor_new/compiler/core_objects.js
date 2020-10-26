const path = require("path");
const cp = require("child_process");

class CompilerExecution {
  constructor(filePath, language, callback, settings) {
    if ("timeout" in settings) {
      this.timeout = settings.timeout;
    } else {
      this.timeout = 5000;
    }
    this.generateProcess(filePath, language, callback);
  }

  async generateProcess(filePath, language, callback) {
    const cmd = await path.resolve(__dirname, `run_scripts/${language}.sh`);
    cp.execFile(
      cmd,
      [filePath],
      {
        timeout: this.timeout,
      },
      function (err, stdout, stderr) {
        if (err) {
          if (err.killed) {
            callback(null, "Execution timeout occured");
          } else {
            callback(null, String(err));
          }
        } else {
          callback(stdout, stderr);
        }
      }
    );
  }
}

module.exports = {
  CompilerExecution,
};
