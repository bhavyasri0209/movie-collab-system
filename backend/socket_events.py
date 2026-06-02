from flask_socketio import emit

import extensions

# STORE ONLINE USERS
online_users = []

def register_socket_events(socketio):

    # USER CONNECT
    @socketio.on('connect')
    def handle_connect():

        print("User Connected")

    # USER JOIN
    @socketio.on('join_user')
    def join_user(data):

        username = data['user']

        if username not in online_users:

            online_users.append(username)

        emit(
            'online_users',
            online_users,
            broadcast=True
        )

    # CHAT MESSAGE
    @socketio.on('send_message')
    def handle_message(data):

        message = {

            "user": data['user'],

            "message": data['message']
        }

        result = extensions.mongo_db.messages.insert_one(
            message
        )

        message['_id'] = str(result.inserted_id)

        emit(
            'receive_message',
            message,
            broadcast=True
        )

    # NOTIFICATION
    @socketio.on('send_notification')
    def send_notification(data):

        notification = {

            "title": data['title'],

            "message": data['message']
        }

        result = extensions.mongo_db.notifications.insert_one(
            notification
        )

        notification['_id'] = str(result.inserted_id)

        emit(
            'receive_notification',
            notification,
            broadcast=True
        )