const Docker = require("dockerode");
const localUtil = require("./util");
const streams = require("memory-streams");
class ContainerManager {
  constructor(config) {
    this.host = config.host || "socket-proxy";
    this.port = config.port || 2375;
    this.setup();
  }

  setup() {
    // setup Docker host
    this.docker = new Docker({
      protocol: "http",
      host: this.host,
      port: this.port,
    });

    // Map languages to images
    this.imageMap = {
      python: {
        image: "python:3.7",
        exists: false,
      },
      java: {
        image: "openjdk:7",
        exists: false,
      },
      c: {
        image: "gcc:4.9",
        exists: false,
      },
      javascript: {
        image: "node:12.18.1",
        exists: false,
      },
    };

    // pull images as needed
    this.pullImages();
  }

  pullImages() {
    const { docker } = this;
    Object.entries(this.imageMap).forEach(
      async function ([language, data]) {
        let that = this;
        const { image } = data;
        try {
          await localUtil.pullImage(docker, image, () => {
            that.imageMap[language].exists = true;
          });
        } catch (error) {
          console.error(error);
        }
      }.bind(this)
    );
  }

  dockerImage(language) {
    console.log(this.imageMap);
    if (language in this.imageMap) {
      if (this.imageMap[language].exists) {
        return this.imageMap[language].image;
      } else throw `Image for language [${language}] still pulling.`;
    } else throw `No valid image for language [${language}].`;
  }

  run(language, buildPath, callback) {
    const stdout = new streams.WritableStream();
    const stderr = new streams.WritableStream();
    buildPath = buildPath.replace(
      "/home/app",
      "/Users/Matan/Desktop/Tryout/executor"
    );
    let image;
    try {
      image = this.dockerImage(language);
    } catch (e) {
      callback(null, null, e);
      return;
    }
    this.docker
      .run(image, ["tmp/run.sh"], [stdout, stderr], {
        Tty: false,
        HostConfig: {
          Binds: [`${buildPath}:/tmp`],
        },
      })
      .then(([res, container]) => {
        callback(stdout.toString(), stderr.toString());
        return container.remove();
      })
      .catch((e) => callback(null, null, e.json.message));
  }
}

module.exports = {
  ContainerManager,
};
