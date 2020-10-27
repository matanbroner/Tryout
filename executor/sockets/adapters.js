class MemoryRoomAdapter {
  constructor() {
    this.rooms = {};
  }

  /**
   * Adds user to room's key value storage
   * @param  {String} userId
   * @param  {String} roomId
   */
  join(userId, roomId) {
    if (roomId in this.rooms) {
      this.rooms[roomId].push(userId);
    } else {
      this.rooms[roomId] = [userId];
    }
  }

  /**
   * Removes user from room's key value storage
   * @param  {String} userId
   * @param  {String} roomId
   */
  exit(userId, roomId) {
    if (this.rooms[roomId]) {
      this.rooms[roomId] = this.rooms[roomId].filter((id) => id !== userId);
      if (this.rooms[roomId].length == 0) {
        delete this.rooms[roomId];
      }
    }
  }
}

module.exports = {
  MemoryRoomAdapter,
};
