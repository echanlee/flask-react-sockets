import React, { useState, useEffect } from "react";
import io from "socket.io-client";

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const App = () => {
  const [messages, setMessages] = useState(["Hello And Welcome"]);
  const [message, setMessage] = useState("");
  const [currentRoom, setRoom] = useState("Room 0");
  const [matched, setMatched] = useState("");
  console.log(matched);

  useEffect(() => {
    getMessages();
  }, [messages.length]);

  useEffect(() => {
    match();
  });

  useEffect(() => {
    document.title = `YOU ARE IN ROOM ${currentRoom}`;
  });

  window.onbeforeunload = function (e) {
    socket.emit('removeMe', currentRoom);
};

  const getMessages = () => {
    socket.on("message", msg => {
      setMessages([...messages, msg]);
    });
  };


  // On Change
  const onChange = e => {
    setMessage(e.target.value);
  };

  // On Click
  const onClick = () => {
    if (message !== "") {
      socket.emit("message", message);
      setMessage("");
    } else {
      alert("Please Add A Message");
    }
  };

  const onClickRoom = () => {
    if (message !== "") {
      socket.emit("messageRoom",  {
        message: message,
        room: currentRoom 
    });
      setMessage("");
    } else {
      alert("Please Add A Message");
    }
  };

  const changeRoom = (e) => {
    var room = e.target.value;
    socket.emit('join', {
      room: room,
      currentRoom: currentRoom
    });
    setRoom(room);
  }

  const count = () => {
    console.log('count');
    socket.emit('countRoom', currentRoom);
  }

  const addrestaurant = () => {
    if (message !== "") {
      socket.emit("restaurant", {
        room: currentRoom,
        msg: message
      });
      setMessage("");
    } else {
      alert("Please Add A Message");
    }
  }

  const match = () => {
    socket.on('match', msg => {
      setMatched(msg);
      debugger;
    });
  }

  return (
    <div>
      <p>YOU ARE IN ROOM {currentRoom}</p>
      <button value = 'Room 1' onClick={e => changeRoom(e)}>Room 1</button>
      <button value = 'Room 2' onClick={e => changeRoom(e)}>Room 2</button>
      {messages.length > 0 &&
        messages.map(msg => (
          <div>
            <p>{msg}</p>
          </div>
        ))}
      <input value={message} name="message" onChange={e => onChange(e)} />
      <button onClick={() => onClick()}>Send Message</button> <br></br>
      <button onClick={() => onClickRoom()}>Send Message to room</button> <br></br>
      <button onClick={() => count()}>Count</button><br></br><br></br>
      <button onClick={() => addrestaurant()}>Add to Room</button>
      {match.length > 0 &&
        <p>You have been matched with {matched}</p>
      }
    </div>
  );
};

export default App;