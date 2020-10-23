from flask_socketio import SocketIO, emit, join_room, leave_room

dev_room_table = {}


class SocketHandler:
    def __init__(self, app):
        self.socketio = SocketIO(app)

    def define_room_events(self):
        @self.socketio.on("join_room")
        def on_join_room(config):
            user_id = config.get("user_id")
            room_id = config.get("room_id")
            if user_id and room_id:
                join_room(room_id)
                emit("user_room_join", {"user_id": user_id}, room=room_id)

                if room_id not in dev_room_table:
                    dev_room_table[room_id] = [user_id]
                else:
                    dev_room_table[room_id].append(user_id)

                return True
            else:
                return False, "Invalid data recieved on room join: {}".format(
                    {"user_id": user_id, "room_id": room_id}
                )

        @self.socketio.on('exit_room')
        def on_exit_room(config):
            user_id = config.get("user_id")
            room_id = config.get("room_id")
            if user_id and room_id:
                leave_room(room_id)
                emit("user_room_exit", {"user_id": user_id}, room=room_id)
                dev_room_table[room_id] = [user for user in dev_room_table[room_id] if user != user_id]
                if len(dev_room_table[room_id]) == 0:
                    del dev_room_table[room_id]