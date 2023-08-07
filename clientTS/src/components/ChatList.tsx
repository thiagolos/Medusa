import Chat from "./Messaging";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";
import type { User } from '../Types/Chat';

function ChatList() {

  const { roomLists, socket} = useContext(ChatContext);

  // console.log(roomLists); // NOTE roomLists is array of users
  const index = roomLists.findIndex((user: User) => user.socketId === socket.id);

  if (index === -1) {
    return
  }

  return (
    <>
        <div>
              {roomLists[index].rooms.map((room) => (
                <div className="ChatList" key={room.name}>
                  <Chat room={room.name} socket={socket}></Chat>
                </div>
              ))}
        </div>
    </>
  );

}

export default ChatList;


