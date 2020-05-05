from flask import Flask, session, request;
from flask_socketio import SocketIO, send, join_room, leave_room, emit, rooms

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'
room_clients = {'Room 0' : 0, 'Room 1': 0, 'Room 2':0}
restaurants = {}


# @sio.event
# def begin_chat(sid):
#    sio.enter_room()

@socketIo.on('connect')
def on_Connect():
    join_room('Room 0')
    print(request.sid + " connECTED")
    return None

@socketIo.on('removeMe')
def test_yeet(currentRoom):
    print('Client disconnected from '+currentRoom)


@socketIo.on('join')
def on_join(room):
    join_room(room)
    print('entered room: '+ room)
    return None

@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None

@socketIo.on("countRoom")
def countRoom(currentRoom):
    print(socketIo.rooms['/'][currentRoom])
    # emit('countRoom', room.length, room = currentRoom)
    return None

# @socketIo.on('leave')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     leave_room(room)
#     send(username + ' has left the room.', room=room)

@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None

@socketIo.on("messageRoom")
def handleMessage(data):
    room = data['room']
    msg = data['message']
    print(data['message']+"    "+data['room'])
    send(msg, room=room)
    return None


if __name__ == '__main__':
    socketIo.run(app)