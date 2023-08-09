import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext
} from "react";
import {
  socketEmit,
  socket,
  addSocketListener,
  removeSocketListener
} from "../apiService";
import type { MessageContext, User, MessageData } from "../Types";
import { ChatContext } from "./ChatContext";

const MessageContext = createContext<MessageContext>({} as MessageContext);

type ChatProviderProps = {
  children: ReactNode;
};

function MessageProvider({ children }: ChatProviderProps) {
  const { setRoomName, roomLists, setRoomLists } = useContext(ChatContext);

  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  function handleRoomButtonClick(roomName: string) {
    const existingRoom = roomLists.some(user =>
      user.rooms.some(room => room.name === roomName)
    );
    if (existingRoom) {
      return;
    }

    setRoomName(roomName);

    const roomData = {
      name: roomName,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      creator: socket.id
    };

    socketEmit("join_room", roomData);

    setRoomLists((prevUserList: User[]) => {
      const index = prevUserList.findIndex(user => user.socketId === socket.id);

      const updatedRooms = [
        ...prevUserList[index].rooms,
        { name: roomName, time: roomData.time }
      ];
      const updatedList = {
        socketId: socket.id,
        rooms: updatedRooms
      };
      const updatedRoomLists = [...prevUserList];
      updatedRoomLists[index] = updatedList;

      return updatedRoomLists;
    });
  }

  const sendMessage = async (roomName: string) => {
    if (roomName !== "") {
      const messageData = {
        user: socket.id,
        room: roomName,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        sender: "me",
        socketId: socket.id
      };
      if (message !== "") {
        socketEmit("send_message", messageData);
        setMessageList(list => [...list, messageData]);
        setMessage("");
      }
    }
  };

  useEffect(() => {
    addSocketListener("receive_message", (data: MessageData) => {
      const messageData = {
        ...data,
        sender: data.user === socket.id ? "me" : "other"
      };
      setMessageList(list => [...list, messageData]);
    });

    addSocketListener("joined_empty_room", (roomName: string) => {
      const messageData = {
        user: socket.id,
        room: roomName,
        message:
          "Congrats, you are the first user that came up with this brilliant topic. Feel free, to wait for others to join you and in the meantime, maybe inspire yourself with what your friends talk about. ",
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        sender: "me",
        socketId: socket.id
      };

      !messageList.some(
        existingMessage => existingMessage.message === messageData.message
      ) && setMessageList(list => [...list, messageData]);
    });

    return () => {
      removeSocketListener("receive_message");
      removeSocketListener("joined_empty_room");
    };
  }, [messageList]);

  const value = {
    message,
    setMessage,
    messageList,
    setMessageList,
    sendMessage,
    handleRoomButtonClick
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export { MessageContext, MessageProvider };
