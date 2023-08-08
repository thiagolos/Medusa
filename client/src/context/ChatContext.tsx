import { ReactNode, createContext, useEffect, useState } from "react";
import { socket, addSocketListener, getAll, removeSocketListener, socketEmit } from "../apiService";
import type { ChatContext, Room, RoomData, User, Chatroom, Position } from "../Types";

const ChatContext = createContext({} as ChatContext);

type ChatProviderProps = {
  children: ReactNode
}

function ChatProvider ({ children }: ChatProviderProps) {


  // DEFINTIONS

  // ROOOMS
  const [roomName, setRoomName] = useState<string>("");
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [roomLists, setRoomLists] = useState<User[]>([]);

  const colors = ['rgb(210, 185, 31)', 'rgb(37,73,155)', 'rgb(130,125,188', 'rgb(244,90,51)', 'rgb(217,117,117)'];
  const [bgColor, setBgColor] = useState(colors[0]);

  function handleBackgroundColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
    console.log('I was executed')
  }

    const roomData = {
      name: roomName,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      creator: socket.id,
    };

  // SELECTOR
  const [isSelectorVisible, setSelectorVisible] = useState(true);
  const [isSelectorClosed, setSelectorClosed] = useState(false);

  // POSITIONS
  const [positions, setPositions] = useState<Position[]>([]);


  // LOGIC
  // ROUTES



  // FUNCTIONS

  const joinRoom = (roomName: string) => {
    if(roomName !== "") {
      const userAlreadyInRoom = roomLists.some((list) => list.rooms.some((r) => r.name === roomName))
      if (userAlreadyInRoom) {
        console.log("You are already in this room")
        return
      }
      const existingRoom = chatrooms.some((c) => c.name === roomName);
      if (existingRoom){
        socketEmit("join_room", roomData);

        setRoomLists((prevRoomLists: User[]): User[] => {
          const index = prevRoomLists.findIndex(
            (list: User) => list.socketId === socket.id
            );
            const updatedRooms: RoomData[] = [
              ...prevRoomLists[index].rooms,
              { name: roomName, time: roomData.time },
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
        socketEmit("create_room", roomName);
        socketEmit("join_room", roomData);

        setRoomLists((prevRoomLists) => {
          const index = prevRoomLists.findIndex(
            (list) => list.socketId === socket.id
          );
          const updatedRooms = [
            ...prevRoomLists[index].rooms,
            { name: roomName, time: roomData.time },
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

  const leaveRoom = (roomName: string) => {
    socketEmit("leave_room", roomName);
    setRoomLists((prevRoomLists) => {
      const index = prevRoomLists.findIndex(
        (list) => list.socketId === socket.id
      );
      const updatedRooms = prevRoomLists[index].rooms.filter(
        (r) => r.name !== roomName
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
    addSocketListener("connect", () => {
      setRoomLists((prevRoomLists) => [
        ...prevRoomLists,
        { socketId: socket.id, rooms: [] },
      ]);
    });
    return () => {
      removeSocketListener("connect");
    };
  }, []);

  // UPDATE CHATRROMS

  useEffect(() => {
    addSocketListener("update_chatrooms", (chatrooms: Chatroom[]) => {
      setChatrooms(chatrooms);
    });
    return () => {
      removeSocketListener("update_chatrooms");
    };
  }, []);

  // USER JOINget

  useEffect(() => {
    addSocketListener("user_join", (userData: Room) => {
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
      removeSocketListener("user_join");
    };
  }, [chatrooms]);

  // USER LEAVE

  useEffect(() => {
    addSocketListener("user_leaves", (userData: Room) => {
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
      removeSocketListener("user_leaves");
    };
  }, [chatrooms])

  // GET ALL

  useEffect(() => {
    getAll()
      .then((data) => setChatrooms(data))
      .catch((err) => console.log(err));
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
    roomName,
    setRoomName,
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