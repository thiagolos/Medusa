import Chat from "./Messaging";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";
import { RoomData, User } from "../Types";

function ChatList() {
  const { roomLists, socket } = useContext(ChatContext);

  const index = roomLists.findIndex(
    (user: User) => user.socketId === socket.id
  );

  if (index === -1) {
    return;
  }

  return (
    <>
      <div>
        {roomLists[index].rooms.map((room: RoomData) => (
          <div className="ChatList" key={room.name}>
            <Chat roomName={room.name}></Chat>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatList;
