const Docker = require("dockerode");
const streams = require("memory-streams");

class ContainerManager {
  constructor(config) {
    this.host = config.host || "socket-proxy";
    this.port = config.port || 2375;
    this.setupDockerHost();
  }
  
  setupDockerHost() {
    this.docker = new Docker({
      protocol: "http",
      host: this.host,
      port: this.port,
    });
  }

  run(language, buildPath, callback) {
    const stdout = new streams.WritableStream();
    const stderr = new streams.WritableStream();
    buildPath = buildPath.replace(
      "/home/app",
      "/Users/Matan/Desktop/Tryout/executor"
    );
    this.docker
      .run("python:3.7", ["tmp/run.sh"], [stdout, stderr], {
        Tty: false,
        HostConfig: {
          Binds: [`${buildPath}:/tmp`],
        },
      })
      .then(([res, container]) => {
        callback(stdout.toString(), stderr.toString());
        return container.remove();
      })
      .catch((error) => console.log(error));
  }
}

module.exports = {
  ContainerManager,
};
