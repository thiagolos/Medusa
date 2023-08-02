import io from "socket.io-client";
import { createContext, useEffect, useState } from "react";

const ChatContext = createContext();
const socket = io.connect("http://localhost:3001");

function ChatProvider ({ children }) {


  // DEFINTIONS

  // ROOOMS
  const [room, setRoom] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [roomLists, setRoomLists] = useState([]);

  const colors = ['rgb(210, 185, 31)', 'rgb(37,73,155)', 'rgb(130,125,188', 'rgb(244,90,51)', 'rgb(217,117,117)'];
  const [bgColor, setBgColor] = useState(colors[0]);

  function handleBackgroundColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
    console.log('I was executed')
  }
  
    const roomData = {
      name: room,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      creator: socket.id,
    };
  
  // SELECTOR
  const [isSelectorVisible, setSelectorVisible] = useState(true);
  const [isSelectorClosed, setSelectorClosed] = useState(false);
  
  // POSITIONS
  const [positions, setPositions] = useState([]);


  // LOGIC
  // ROUTES

  function getAll () {
    fetch('http://localhost:3001/chatrooms')
    .then((res) => res.json())
    .then((data) => setChatrooms(data))
    .catch((err) => console.error(err));
  }

  // FUNCTIONS

  const joinRoom = () => {
    if(room !== "") {
      const userAlreadyInRoom = roomLists.some((list) => list.rooms.some((r) => r.name === room))
      if (userAlreadyInRoom) {
        console.log("You are already in this room")
        return 
      }
      const existingRoom = chatrooms.some((c) => c.name === room);
      if (existingRoom){
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

 

  // USE EFFECTS
  // ERSTELLUNG DES STORAGE OBJEKTS

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

  // UPDATE CHATRROMS

  useEffect(() => {
    socket.on("update_chatrooms", (chatrooms) => {
      setChatrooms(chatrooms);
    });
    return () => {
      socket.off("update_chatrooms");
    };
  }, []);

  // USER JOIN

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

  // USER LEAVE

  useEffect(() => {
    socket.on("user_leaves", (userData) => {
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
      socket.off("user_leaves");
    };
  }, [chatrooms])

  // GET ALL 

  useEffect(() => {
    getAll();
  }, [])

  // POSITIONS

  useEffect(() => {
    const newPositions = [];
    for (let i = 0; i < 10; i++) {
      const top = Math.floor(Math.random() * window.innerHeight);
      const left = Math.floor(Math.random() * window.innerWidth);
      newPositions.push({ top, left });
    }
    setPositions(newPositions);
  }, []);


  // TEST LOGS

  // useEffect(()=>{
  //   console.log('CHATROOMS', chatrooms)
  //   console.log('Chatrooms, users', chatrooms[0])
  // })
 // useEffect(() => {
  //   console.log("roomlists after leave:", roomLists)
  // })
    // useEffect(() => {
  //   console.log("roomlists after update ChatContext:", roomLists)
  // })
 

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
    isSelectorVisible,
    colors,
    bgColor,
    setBgColor,
    handleBackgroundColor
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