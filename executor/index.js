const express = require("express");
const cors = require("cors");
const http = require("http");
const { SocketHandler } = require("./sockets");

const app = express();
const server = http.createServer(app);

const socketHandler = new SocketHandler(server);

const PORT = 5700;

socketHandler.listen(PORT);
