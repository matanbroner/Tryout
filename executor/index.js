const express = require("express");
const cors = require("cors");
const http = require("http");
const { SocketHandler } = require("./sockets");
const { ContainerBuilder } = require("./container_builder");

const app = express();
const server = http.createServer(app);

const socketHandler = new SocketHandler(server);
const builder = new ContainerBuilder({});

docker.createContainer(
  {
    Image: "python:3.7",
    Cmd: ["python3", "/stuff"],
    Volumes: {
      "/stuff": {},
    },
    HostConfig: {
      Binds: ["/tmp:/stuff"],
    },
  },
  function (err, container) {
    container.attach(
      {
        stream: true,
        stdout: true,
        stderr: true,
        tty: true,
      },
      function (err, stream) {
        stream.pipe(process.stdout);

        container.start(function (err, data) {
          console.log(data);
        });
      }
    );
  }
);

const PORT = 5700;

socketHandler.listen(PORT);
