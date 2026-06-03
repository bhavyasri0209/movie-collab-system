from flask_socketio import emit
from datetime import datetime
import extensions

def register_socket_events(socketio):

    @socketio.on("connect")
    def handle_connect():
        print("User connected")

    @socketio.on("disconnect")
    def handle_disconnect():
        print("User disconnected")

    @socketio.on("join_user")
    def handle_join(data):

        emit(
            "receive_message",
            {
                "user": "System",
                "message": f"{data['user']} joined the chat"
            },
            broadcast=True
        )

    @socketio.on("send_message")
    def handle_message(data):

        message_data = {
            "user": data["user"],
            "message": data["message"],
            "timestamp": datetime.utcnow()
        }

        extensions.mongo_db.chat_messages.insert_one(
            message_data
        )

        emit(
            "receive_message",
            message_data,
            broadcast=True
        )