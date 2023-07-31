import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { MessageContext } from "./MessageContext";
import SendMessageOnJoin from "../components/SendMessageOnJoin";

const ChatContext = createContext();
const socket = io.connect("http://localhost:3001");

function ChatProvider ({ children }) {


  // DEFINTIONS

  const [room, setRoom] = useState("");
  const [chatrooms, setChatrooms] = useState([])
  const [userCount, setUserCount] = useState(0);

  const [isSelectorVisible, setSelectorVisible] = useState(true)
  const [isSelectorClosed, setSelectorClosed] = useState(false)


  const roomData = {
    name: room,
    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    creator: socket.id,
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


  useEffect(() => {
    socket.on("connect", () => {
      setRoomLists((prevRoomLists) => [
        ...prevRoomLists,
        { socketId: socket.id, rooms: [] },
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

  // useEffect(() => {
  //   console.log("roomlists after update ChatContext:", roomLists)
  // })
  
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

  // useEffect(() => {
  //   console.log("roomlists after leave:", roomLists)
  // })
  

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

      if (userData.userCount === 1) {
        const messageData = {
          user: socket.id,
          room: userData.room,
          message: "Congrats, you are the first user that came up with this brilliant topic. Feel free, to wait for others to join you and in the meantime, maybe inspire yourself with what your friends talk about. ",
          time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
          sender: "me",
          socketId: socket.id,
        };
        socket.emit("send_message", messageData);
      }
    });


    return () => {
      socket.off("user_join");
    };
  }, [chatrooms]);


  useEffect(() => {
    socket.on("user_leaves", (userData) => {
      console.log(userData)
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


  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const newPositions = [];
    for (let i = 0; i < 10; i++) {
      const top = Math.floor(Math.random() * window.innerHeight);
      const left = Math.floor(Math.random() * window.innerWidth);
      newPositions.push({ top, left });
    }
    setPositions(newPositions);
  }, []);

  useEffect(()=>{
    console.log('CHATROOMS', chatrooms)
    console.log('Chatrooms, users', chatrooms[0])
  })

 

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
    positions,
    setPositions,
    setSelectorClosed,
    setSelectorVisible,
    isSelectorClosed,
    isSelectorVisible
  }

  return (
    < ChatContext.Provider value={value} >
      {/* <SendMessageOnJoin /> */}
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