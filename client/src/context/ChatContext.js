import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { MessageContext } from "./MessageContext";

const ChatContext = createContext();
const socket = io.connect("http://localhost:3001");

function ChatProvider ({ children }) {


  // DEFINTIONS

  const [room, setRoom] = useState("");
  const [chatrooms, setChatrooms] = useState([])
  const [userCount, setUserCount] = useState(0);

  const roomData = {
    name: room,
    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    creator: socket.id,
    // users: userCount
    // name of Users in Room 
  }

  // ROUTES

  function getAll () {
    fetch('http://localhost:3001/chatrooms')
    .then((res) => res.json())
    .then((data) => setChatrooms(data))
    .catch((err) => console.error(err));
  }

  // ERSTELLUNG DES STORAGE OBJEKTS

  const [roomLists, setRoomLists] = useState([]);
  const [color, setColor] = useState("#e2c6f8");


  useEffect(() => {
    socket.on("connect", () => {
      setRoomLists((prevRoomLists) => [
        ...prevRoomLists,
        { socketId: socket.id, color: '#e2c6f8', rooms: [] },
      ]);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  

  // FUNCTIONS

  const joinRoom = () => {
    if(room !== "") {
      const existingRoom = roomLists.some((list) => list.rooms.some((r) => r.name === room))
      if (existingRoom) {
        console.log("You are already in this room")
        return 
      }
      if (chatrooms.some((c) => c.name === room)){
        socket.emit("join_room", roomData);

        setRoomLists((prevRoomLists) => {
          const index = prevRoomLists.findIndex(
            (list) => list.socketId === socket.id
          );
          const updatedRooms = [
            ...prevRoomLists[index].rooms,
            { name: room, time: roomData.time },
          ];
          const updatedList = {
            socketId: socket.id,
            rooms: updatedRooms,
          };
          const updatedRoomLists = [...prevRoomLists];
          updatedRoomLists[index] = updatedList;
          return updatedRoomLists;
        });

      } else {
        socket.emit("create_room", room);
        socket.emit("join_room", roomData);

        setRoomLists((prevRoomLists) => {
          const index = prevRoomLists.findIndex(
            (list) => list.socketId === socket.id
          );
          const updatedRooms = [
            ...prevRoomLists[index].rooms,
            { name: room, time: roomData.time },
          ];
          const updatedList = {
            socketId: socket.id,
            rooms: updatedRooms,
          };
          const updatedRoomLists = [...prevRoomLists];
          updatedRoomLists[index] = updatedList;
          return updatedRoomLists;
        });
      }
    }
  };

  useEffect(() => {
    console.log("roomlists after update ChatContext:", roomLists)
  })
  
  const leaveRoom = (room) => {
    socket.emit("leave_room", room);
    setRoomLists((prevRoomLists) => {
      const index = prevRoomLists.findIndex(
        (list) => list.socketId === socket.id
      );
      const updatedRooms = prevRoomLists[index].rooms.filter(
        (r) => r.name !== room
      );
      const updatedList = {
        socketId: socket.id,
        rooms: updatedRooms,
      };
      const updatedRoomLists = [...prevRoomLists];
      updatedRoomLists[index] = updatedList;
      return updatedRoomLists;
    });
  }

  useEffect(() => {
    console.log("roomlists after leave:", roomLists)
  })
  

  // USE EFFECTS


  useEffect(() => {
    socket.on("update_chatrooms", (chatrooms) => {
      setChatrooms(chatrooms);
    });
    return () => {
      socket.off("update_chatrooms");
    };
  }, []);

  useEffect(() => {
    socket.on("user_join", (userData) => {
      const updatedChatrooms = chatrooms.map((chatroom) => {
        if (chatroom.name === userData.room) {
          return {
            ...chatroom,
            users: userData.userCount,
            usernames: userData.usernames,
          };
        } else {
          return chatroom;
        }
      });
      setChatrooms(updatedChatrooms);
      console.log(`User ${userData.username} joined the chatroom ${userData.room}. Users: ${userData.userCount}. Usernames: ${userData.usernames.join(", ")}`);
    });

    return () => {
      socket.off("user_join");
    };
  }, [chatrooms]);


  useEffect(() => {
    socket.on("user_leaves", (userData) => {
      console.log(userData)
      console.log('hello')
      const updatedChatrooms = chatrooms.map((chatroom) => {
        if (chatroom.name === userData.room) {
          return {
            ...chatroom,
            users: userData.userCount,
            usernames: userData.usernames,
          };
        } else {
          return chatroom;
        }
      });
      setChatrooms(updatedChatrooms);
      console.log(`User ${userData.username} left the chatroom ${userData.room}. Users: ${userData.userCount}. Usernames: ${userData.usernames.join(", ")}`);
    });

    return () => {
      socket.off("user_geht");
    };
  }, [chatrooms])


  useEffect(() => {
    getAll();
  }, [])
 

  const value = {
    roomData,
    room,
    setRoom,
    chatrooms,
    setChatrooms,
    getAll,
    socket,
    userCount,
    setUserCount,
    joinRoom,
    leaveRoom,
    roomLists,
    setRoomLists,
  }

  return (
    < ChatContext.Provider value={value} >
      {children}
    </ ChatContext.Provider>
  )
}

export { ChatContext, ChatProvider }



  // function postOne () {
  //   fetch('http://localhost:3001/chatrooms', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(roomData)
  // })
  //   .then(res => res.json())
  //   .then(res => getAll())
  //   .catch(error => console.log(error));
  // }