const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);
const { SocketHandler } = require("./sockets");

const socketHandler = new SocketHandler(server);

const PORT = 5700;

socketHandler.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on port ${PORT}`);
});
