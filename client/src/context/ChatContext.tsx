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
  const [roomName, setRoomName] = useState<string>("");
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [roomLists, setRoomLists] = useState<User[]>([]);

  const [isSelectorVisible, setSelectorVisible] = useState(true);
  const [isSelectorClosed, setSelectorClosed] = useState(false);

  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    addSocketListener("connect", () => {
      setRoomLists(prevRoomLists => [
        ...prevRoomLists,
        { socketId: socket.id, rooms: [] }
      ]);
    });

    addSocketListener("update_chatrooms", (chatrooms: Chatroom[]) => {
      setChatrooms(chatrooms);
    });

    getAll()
      .then(data => setChatrooms(data))
      .catch(err => console.log(err));

    const newPositions = [];
    for (let i = 0; i < 10; i++) {
      const top = Math.floor(Math.random() * window.innerHeight);
      const left = Math.floor(Math.random() * window.innerWidth);
      newPositions.push({ top, left });
    }
    setPositions(newPositions);

    return () => {
      removeSocketListener("connect");
      removeSocketListener("update_chatrooms");
    };
  }, []);

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
      removeSocketListener("user_join");
      removeSocketListener("user_leaves");
    };
  }, [chatrooms]);



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

        setRoomLists((prevRoomLists: User[]): User[] => {
          const index = prevRoomLists.findIndex(
            (list: User) => list.socketId === socket.id
          );
          const updatedRooms: RoomData[] = [
            ...prevRoomLists[index].rooms,
            { name: roomName, time: roomData.time }
          ];
          const updatedList = {
            socketId: socket.id,
            rooms: updatedRooms
          };
          const updatedRoomLists = [...prevRoomLists];
          updatedRoomLists[index] = updatedList;
          return updatedRoomLists;
        });
      } else {
        socketEmit("create_room", roomName);
        socketEmit("join_room", roomData);

        setRoomLists(prevRoomLists => {
          const index = prevRoomLists.findIndex(
            list => list.socketId === socket.id
          );
          const updatedRooms = [
            ...prevRoomLists[index].rooms,
            { name: roomName, time: roomData.time }
          ];
          const updatedList = {
            socketId: socket.id,
            rooms: updatedRooms
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
    setRoomLists(prevRoomLists => {
      const index = prevRoomLists.findIndex(
        list => list.socketId === socket.id
      );
      const updatedRooms = prevRoomLists[index].rooms.filter(
        r => r.name !== roomName
      );
      const updatedList = {
        socketId: socket.id,
        rooms: updatedRooms
      };
      const updatedRoomLists = [...prevRoomLists];
      updatedRoomLists[index] = updatedList;
      return updatedRoomLists;
    });
  };

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
    isSelectorVisible
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export { ChatContext, ChatProvider };
