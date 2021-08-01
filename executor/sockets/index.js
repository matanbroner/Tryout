const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const uuid = require("uuid");
const constants = require("./constants");
const { MemoryRoomAdapter } = require("./adapters");
const { Compiler } = require("../compiler");
const { TryoutFileDb } = require("../db");

class SocketHandler {
  constructor(server) {
    this.server = server;
    this.roomStorage = new MemoryRoomAdapter();
    this.compiler = new Compiler();
    this.fileDb = TryoutFileDb;
  }

  /**
   * Starts listening on given HTTP server
   * @param  {Number} port
   */
  listen(port, callback) {
    let that = this;
    this.server.listen(port, async () => {
      try {
        await that.fileDb.connect();
        if (callback) {
          callback();
        }
        this.setupTransport();
      } catch (err) {
        if (callback) {
          callback(err);
        } else {
          throw err;
        }
      }
    });
  }

  send(socket, data) {
    data.internal = true;
    socket.send(JSON.stringify(data));
  }

  emit(roomId, data) {
    const members = this.roomStorage.members(roomId);
    members.forEach(
      function (member) {
        this.send(member.socket, data);
      }.bind(this)
    );
  }

  /**
   * Generates callback to be called after compiler execution
   * @param  {String} roomId
   * @returns {Function} callback accepting output and errors
   */
  generateCompileCallback(roomId) {
    const callback = (stdout, stderr, sysout) => {
      console.log(`Emitting roomId: [${roomId}] compile_complete`);
      this.emit(roomId, {
        event: constants.COMPILE_COMPLETE,
        data: {
          stdout,
          stderr,
          sysout,
        },
      });
    };
    return callback;
  }

  /**
   * Initiates WebSockets server connection
   */
  setupTransport() {
    const { server } = this;
    this.wss = new WebSocket.Server({ server });
    this.wss.on(
      constants.CONNECTION,
      function (socket) {
        socket.id = uuid.v4();
        console.log(`WebSocket connected: ${socket.id}`);

        // set up ShareDB JSON stream
        const stream = new WebSocketJSONStream(socket);
        this.fileDb.listenJsonStream(stream);
        this.defineEventHandlers(socket);
      }.bind(this)
    );
  }

  /**
   * Defines event handlers for individual sockets
   * @param  {WebSocket} socket
   */
  defineEventHandlers(socket) {
    socket.on(
      constants.MESSAGE,
      function (message) {
        try {
          message = JSON.parse(message);
        } catch (e) {
          this.send(socket, {
            event: constants.BAD_FORMAT,
          });
          return;
        }
        switch (message.event) {
          case constants.REQUEST_WS_ID: {
            console.log("got id request");
            this.send(socket, {
              event: constants.ESTABLISH_WS_ID,
              data: {
                id: socket.id,
              },
            });
            break;
          }
          case constants.JOIN_ROOM: {
            const { userId, roomId } = message.data;
            if (roomId && userId) {
              this.roomStorage.join(socket, userId, roomId);
            }
            break;
          }
          case constants.EXIT_ROOM: {
            const { userId, roomId } = message.data;
            if (roomId && userId) {
              // empty rooms are deleted automatically
              this.roomStorage.exit(userId, roomId);
              console.log(`User ${userId} leaving room ${roomId}`);
            }
            break;
          }
          case constants.COMPILE_INIT: {
            const { files, language, roomId } = message.data;
            const callback = this.generateCompileCallback(roomId);
            try {
              if (!files || !language) {
                throw "Missing one or more of arguments [files, language]";
              }
              this.compiler.runCode(files, language, callback);
            } catch (e) {
              callback(null, e);
            }
            break;
          }
        }
      }.bind(this)
    );
  }
}

module.exports = {
  SocketHandler,
};
