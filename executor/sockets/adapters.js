class MemoryRoomAdapter {
  constructor() {
    this.rooms = {};
  }

  /**
   * Adds user to room's key value storage
   * @param  {String} userId
   * @param  {String} roomId
   */
  join(socket, userId, roomId) {
    if (roomId in this.rooms) {
      this.rooms[roomId].push({socket, userId});
    } else {
      this.rooms[roomId] = [{socket, userId}];
    }
  }

  /**
   * Removes user from room's key value storage
   * @param  {String} userId
   * @param  {String} roomId
   */
  exit(userId, roomId) {
    if (this.rooms[roomId]) {
      this.rooms[roomId] = this.rooms[roomId].filter((member) => member.userId !== userId);
      if (this.rooms[roomId].length == 0) {
        delete this.rooms[roomId];
      }
    }
  }

  members(roomId){
    return this.rooms[roomId] || []
  }
}

module.exports = {
  MemoryRoomAdapter,
};
