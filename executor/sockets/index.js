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

  /**
   * Starts listening on given HTTP server
   * @param  {Number} port
   */
  listen(port) {
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  /**
   * Generates callback to be called after compiler execution
   * @param  {String} roomId
   * @returns {Function} callback accepting output and errors
   */
  generateCompileCallback(roomId) {
    const callback = (output, errors) => {
      console.log(`Emitting roomId: [${roomId}] compile_complete`);
      this.io.to(roomId).emit(constants.COMPILE_COMPLETE, {
        stdout: output,
        stderr: errors,
      });
    };
    return callback;
  }

  /**
   * Initiates Socket.IO server connection
   */
  setupTransport() {
    this.io = socketio(this.server);
    this.io.origins("*:*");
    this.io.on(
      constants.CONNECTION,
      function (socket) {
        console.log(`Socket connected: ${socket.id}`);
        this.defineRoomEvents(socket);
        this.defineCompilerEvents(socket);
      }.bind(this)
    );
  }

  /**
   * Defines events associated with Socket.IO rooms
   * @param  {socketio.socket} socket
   */
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

  /**
   * Defines events associated with compilation
   * @param  {socketio.socket} socket
   */
  defineCompilerEvents(socket) {
    socket.on(
      constants.COMPILE_INIT,
      function (data) {
        const { files, language, roomId } = data;
        const callback = this.generateCompileCallback(roomId);
        try {
          if (!files || !language) {
            throw "Missing one or more of arguments [files, language]";
          }
          this.compiler.runCode(files, language, callback);
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
