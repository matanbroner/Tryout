from flask_socketio import SocketIO, emit, join_room, leave_room


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
