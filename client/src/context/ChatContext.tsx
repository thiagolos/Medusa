import { ReactNode, createContext, useEffect, useState } from "react";
import {
  socket,
  addSocketListener,
  getAll,
  removeSocketListener,
  socketEmit
} from "../apiService";
import type {
  ChatContext,
  Room,
  RoomData,
  User,
  Chatroom,
  Position
} from "../Types";

const ChatContext = createContext({} as ChatContext);

type ChatProviderProps = {
  children: ReactNode;
};

function ChatProvider({ children }: ChatProviderProps) {
  // Room States
  const [roomName, setRoomName] = useState<string>("");
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [roomLists, setRoomLists] = useState<User[]>([]);
  const colors = [
    "rgb(210, 185, 31)",
    "rgb(37,73,155)",
    "rgb(130,125,188",
    "rgb(244,90,51)",
    "rgb(217,117,117)"
  ];
  const [bgColor, setBgColor] = useState(colors[0]);

  // SELECTOR
  const [isSelectorVisible, setSelectorVisible] = useState(true);
  const [isSelectorClosed, setSelectorClosed] = useState(false);

  // POSITIONS
  const [positions, setPositions] = useState<Position[]>([]);

  function handleBackgroundColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }

  const roomData = {
    name: roomName,
    time:
      new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    creator: socket.id
  };

  const joinRoom = (roomName: string) => {
    if (roomName !== "") {
      const userAlreadyInRoom = roomLists.some(list =>
        list.rooms.some(r => r.name === roomName)
      );
      if (userAlreadyInRoom) {
        return;
      }
      const existingRoom = chatrooms.some(c => c.name === roomName);
      if (existingRoom) {
        socketEmit("join_room", roomData);

        setRoomLists((currentRoomList: User[]): User[] => {
          const index = currentRoomList.findIndex(
            (list: User) => list.socketId === socket.id
          );
          const updatedRooms: RoomData[] = [
            ...currentRoomList[index].rooms,
            { name: roomName, time: roomData.time }
          ];
          const updatedList = {
            socketId: socket.id,
            rooms: updatedRooms
          };
          const updatedRoomLists = [...currentRoomList];
          updatedRoomLists[index] = updatedList;
          return updatedRoomLists;
        });
      } else {
        socketEmit("create_room", roomName);
        socketEmit("join_room", roomData);

        setRoomLists(currentRoomList => {
          const index = currentRoomList.findIndex(
            list => list.socketId === socket.id
          );
          const updatedRooms = [
            ...currentRoomList[index].rooms,
            { name: roomName, time: roomData.time }
          ];
          const updatedList = {
            socketId: socket.id,
            rooms: updatedRooms
          };
          const updatedRoomLists = [...currentRoomList];
          updatedRoomLists[index] = updatedList;
          return updatedRoomLists;
        });
      }
    }
  };

  const leaveRoom = (roomName: string) => {
    socketEmit("leave_room", roomName);
    setRoomLists(currentRoomList => {
      const index = currentRoomList.findIndex(
        list => list.socketId === socket.id
      );
      const updatedRooms = currentRoomList[index].rooms.filter(
        r => r.name !== roomName
      );
      const updatedList = {
        socketId: socket.id,
        rooms: updatedRooms
      };
    
      if (updatedRooms.length === 0){
        setSelectorVisible(true);
        setSelectorClosed(false);
      }

      const updatedRoomLists = [...currentRoomList];
      updatedRoomLists[index] = updatedList;
      return updatedRoomLists;
    });
  };

  useEffect(() => {
    addSocketListener("connect", () => {
      setRoomLists(currentRoomList => [
        ...currentRoomList,
        { socketId: socket.id, rooms: [] }
      ]);
    });
    return () => {
      removeSocketListener("connect");
    };
  }, []);

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
      const updatedChatrooms = chatrooms.map(chatroom => {
        if (chatroom.name === userData.room) {
          return {
            ...chatroom,
            users: userData.userCount,
            usernames: userData.usernames
          };
        } else {
          return chatroom;
        }
      });
      setChatrooms(updatedChatrooms);
    });

    return () => {
      removeSocketListener("user_join");
    };
  }, [chatrooms]);

  // USER LEAVE

  useEffect(() => {
    addSocketListener("user_leaves", (userData: Room) => {
      const updatedChatrooms = chatrooms.map(chatroom => {
        if (chatroom.name === userData.room) {
          return {
            ...chatroom,
            users: userData.userCount,
            usernames: userData.usernames
          };
        } else {
          return chatroom;
        }
      });
      setChatrooms(updatedChatrooms);
    });

    return () => {
      removeSocketListener("user_leaves");
    };
  }, [chatrooms]);

  // GET ALL

  useEffect(() => {
    getAll()
      .then(data => setChatrooms(data))
      .catch(err => console.log(err));
  }, []);

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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export { ChatContext, ChatProvider };

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
