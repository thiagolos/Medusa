import { createContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";

const MessageContext = createContext();

function MessageProvider ({ children }) {

  const {socket, setRoom, roomLists, setRoomLists, room} = useContext(ChatContext)

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([])


  function handleRoomButtonClick(roomName) {

    const existingRoom = roomLists.some((list) =>
        list.rooms.some((r) => r.name === roomName)
      );
      if (existingRoom) {
        console.log("You are already in this room.");
        return;
    }

    setRoom(roomName);
    const roomData = {
      name: roomName,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      creator: socket.id,
    };
    console.log("Room Data from RoomList:", roomData);
    socket.emit("join_room", roomData);
  
    setRoomLists((prevRoomLists) => {
      const index = prevRoomLists.findIndex((list) => list.socketId === socket.id);
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
  
      console.log("Updated Rooms RoomList:", updatedRooms);
  
      return updatedRoomLists;
    });
  }


  const sendMessage = async (room) => {
    if (room !== "") {
      const messageData = {
        user: socket.id,
        room: room,
        message: message,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        sender: "me",
        socketId: socket.id
      }
      if (message !== "") {
        await socket.emit("send_message", messageData);
        console.log('message sent:', messageData)
        setMessageList((list) => [...list, messageData])
        setMessage("");
      }
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
        console.log('message received', data)
        const messageData = {
          ...data,
          sender: data.user === socket.id ? "me" : "other"
        }
      setMessageList((list) => [...list, messageData]);
      console.log('messageList', messageList)
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    console.log('messageList:', messageList);
  }, [messageList]);
  


  const value = {
    message,
    setMessage,
    messageList,
    setMessageList,
    sendMessage,
    handleRoomButtonClick
  }

  return (
    < MessageContext.Provider value={value} >
      {children}
    </ MessageContext.Provider>
  )
}

export { MessageContext, MessageProvider }