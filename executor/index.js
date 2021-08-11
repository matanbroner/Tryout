const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const router = require("./api/router");

const app = express();

// TODO: remove
app.use(cors());

app.use(bodyParser.json());
app.use(router);

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
