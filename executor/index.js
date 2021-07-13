const express = require("express");
const cors = require("cors");
const http = require("http");
const { SocketHandler } = require("./sockets");

const { shareDb } = require("./file_manager/db");

const app = express();
const server = http.createServer(app);

const socketHandler = new SocketHandler(server);

app.get("/image-status", (req, res) => {
  const bars = socketHandler.compiler.containerManager.imagePullStatus();
  res.send(bars);
});

const PORT = 5700;

socketHandler.listen(PORT);
