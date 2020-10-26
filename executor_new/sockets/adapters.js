class MemoryRoomAdapter {
  constructor() {
    this.rooms = {};
  }

  join(userId, roomId) {
    if (roomId in this.rooms) {
      this.rooms[roomId].push(userId);
    } else {
      this.rooms[roomId] = [userId];
    }
  }

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
    MemoryRoomAdapter
}
