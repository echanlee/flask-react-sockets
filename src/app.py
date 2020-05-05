from flask import Flask, session, request;
from flask_socketio import SocketIO, send, join_room, leave_room, emit

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
    room_clients['Room 0'] += 1
    return None

@socketIo.on('removeMe')
def test_yeet(currentRoom):
    print('Client disconnected from '+currentRoom)
    room_clients[currentRoom] -= 1
    print(room_clients)
    return None


@socketIo.on('join')
def on_join(rooms):
    join_room(rooms['room'])
    print(room_clients)
    room_clients[rooms['room']] += 1
    room_clients[rooms['currentRoom']] -= 1
    print(room_clients)
    print('entered room: '+ rooms['room'] + ' and left '+ rooms['currentRoom']+ ' count of current room '+room_clients[rooms['room']] )
    return None

@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None

@socketIo.on("countRoom")
def countRoom(currentRoom):
    send(room_clients[currentRoom], room = currentRoom)
    return None


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

@socketIo.on('restaurant')
def addRestaurant(data):
    room = data['room']
    msg = data['msg']
    if room in restaurants:
        if msg in restaurants[room]:
            restaurants[room][msg] += 1
        else:
            restaurants[room][msg] = 1
    else:
        restaurants[room] = {}
        restaurants[room][msg] =1
    
    print (restaurants[room][msg])
    print( room_clients[room])
    print(restaurants)
    if restaurants[room][msg] >= room_clients[room]:
        print('heyo')
        emit('match', msg, room=room)


if __name__ == '__main__':
    socketIo.run(app)