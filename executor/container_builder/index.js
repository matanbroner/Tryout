const Docker = require("dockerode");
class ContainerBuilder {
  constructor(config) {
    this.host = config.host || "socket-proxy";
    this.port = config.port || 2375;
    this.docker = new Docker({
      protocol: "http",
      host: this.host,
      port: this.port,
    });
  }
}

module.exports = {
  ContainerBuilder,
};
