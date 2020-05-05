import React, { useState, useEffect } from "react";
import io from "socket.io-client";

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const App = () => {
  const [messages, setMessages] = useState(["Hello And Welcome"]);
  const [message, setMessage] = useState("");
  const [currentRoom, setRoom] = useState("Room 0");

  useEffect(() => {
    console.log(currentRoom)
    getMessages();
  }, [messages.length]);


  window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = 'heyo';
  });


  // useEffect(() => {
  //   const cleanup = () => {
  //     alert("hello world");
  //     socket.emit('removeMe', currentRoom);
  //     socket.emit("message", "kill me");
  //   }
  
  //   window.addEventListener('beforeunload', cleanup);
  
  //   return () => {
  //     window.removeEventListener('beforeunload', cleanup);
  //   }
  // }, []);

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
    console.log(window);
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
    var room = e.target.value
    setRoom(room)
    socket.emit('join', room);
  }

  const count = () => {
    console.log('count');
    socket.emit('countRoom', currentRoom);
  }

  const getCount = () => {
    socket.on('countRoom', (count) => {
      console.log('count is'+count);
    });
  }

  const disconnect = () => {
    socket.on('disconnect', () =>{
      socket.emit('disconnect', currentRoom);
    });
  }

  return (
    <div>
      <button value = 'room 1' onClick={e => changeRoom(e)}>Room 1</button>
      <button value = 'room 2' onClick={e => changeRoom(e)}>Room 2</button>
      {messages.length > 0 &&
        messages.map(msg => (
          <div>
            <p>{msg}</p>
          </div>
        ))}
      <input value={message} name="message" onChange={e => onChange(e)} />
      <button onClick={() => onClick()}>Send Message</button> <br></br>
      <button onClick={() => onClickRoom()}>Send Message to room</button> <br></br>
      <button onClick={() => count()}>Count</button>
    </div>
  );
};

export default App;