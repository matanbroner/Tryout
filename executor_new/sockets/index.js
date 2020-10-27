const socketio = require("socket.io");
const constants = require("./constants");
const { MemoryRoomAdapter } = require("./adapters");
const { Compiler } = require("../compiler");

class SocketHandler {
  constructor(server) {
    this.server = server;
    this.roomStorage = new MemoryRoomAdapter();
    this.compiler = new Compiler();
    this.setupTransport();
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  generateCompileCallback(roomId) {
    const callback = (output, errors) => {
      console.log(`Emitting roomId: [${roomId}] compile_complete`)
      this.io.to(roomId).emit(constants.COMPILE_COMPLETE, {
        stdout: output,
        stderr: errors,
      });
    };
    return callback;
  }

  setupTransport() {
    this.io = socketio(this.server);
    this.io.origins("*:*");
    this.io.on(
      constants.CONNECTION,
      function (socket) {
        console.log(`Socket connected: ${socket.id}`)
        this.defineRoomEvents(socket);
        this.defineCompilerEvents(socket);
      }.bind(this)
    );
  }

  defineRoomEvents(socket) {
    socket.on(
      constants.JOIN_ROOM,
      function (data) {
        const userId = data.userId;
        const roomId = data.roomId;

        if (roomId && userId) {
          socket.join(roomId);
          this.roomStorage.join(userId, roomId);
        }
      }.bind(this)
    );
    socket.on(
      constants.EXIT_ROOM,
      function (data) {
        const userId = data.userId;
        const roomId = data.roomId;

        if (roomId && userId) {
          socket.leave(roomId);
          // empty rooms are deleted automatically
          this.roomStorage.exit(userId, roomId);
        }
      }.bind(this)
    );
  }

  defineCompilerEvents(socket) {
    socket.on(
      constants.COMPILE_INIT,
      function (data) {
        const { code, language, roomId } = data;
        const callback = this.generateCompileCallback(roomId);
        try {
          if (!code || !language) {
            throw "Missing one or more of arguments [code, language]";
          }
          this.compiler.runCode(code, language, callback);
        } catch (e) {
          callback(null, e);
        }
      }.bind(this)
    );
  }
}

module.exports = {
  SocketHandler,
};