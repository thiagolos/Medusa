import { createContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";
import { socketEmit, socket, addSocketListener, removeSocketListener } from "../apiService";
import type { User } from '../Types/Chat';

const MessageContext = createContext(null);

function MessageProvider ({ children }) {

  const { setRoom, roomLists, setRoomLists } = useContext(ChatContext)

  // DEFINITIONS

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([])


  // MESSAGE FUNCTIONALITY

  function handleRoomButtonClick(roomName: string) {

    const existingRoom = roomLists.some((list: User) =>
        list.rooms.some((str) => str === roomName) // FIXME pre: list.rooms.some((str) => str.name === roomName)
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
    socketEmit("join_room", roomData)

    setRoomLists((prevRoomLists: User[]) => {
      const index = prevRoomLists.findIndex((list: User) => list.socketId === socket.id);
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
        socketEmit("send_message", messageData);
        console.log('message sent:', messageData)
        setMessageList((list) => [...list, messageData])
        setMessage("");
      }
    }
  };

  // USE EFFECTS
  // RECEIVE MESSAGE & JOIN EMPTY ROOM

  useEffect(() => {
    addSocketListener("receive_message", (data) => {
      console.log('message received', data)
      const messageData = {
        ...data,
        sender: data.user === socket.id ? "me" : "other"
      }
      setMessageList((list) => [...list, messageData]);
      console.log('messageList', messageList)
    });

    addSocketListener('joined_empty_room', (roomName) => {
      console.log('joined_empty_room:', socket.id);
      const messageData = {
        user: socket.id,
        room: roomName,
        message: "Congrats, you are the first user that came up with this brilliant topic. Feel free, to wait for others to join you and in the meantime, maybe inspire yourself with what your friends talk about. ",
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        sender: "me",
        socketId: socket.id,
      }
      setMessageList((list) => [...list, messageData]);
    });

    return () => {
      removeSocketListener("receive_message");
      removeSocketListener("joined_empty_room");
    };

  }, []);


  // TEST LOGS

  // useEffect(() => {
  //   console.log('messageList:', messageList);
  // }, [messageList]);

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