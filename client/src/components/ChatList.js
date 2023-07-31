import Chat from "./Messaging";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

function ChatList() {

  const { roomLists, socket } = useContext(ChatContext);

  const index = roomLists.findIndex((list) => list.socketId === socket.id);

  if (index === -1) {
    return 
  }

  return (
    <>
        <div className="ChatList">
          <div>
            {roomLists[index].rooms.map((room) => (
              <div key={room.name}>
                {room.name} - {room.time}
                <Chat room={room.name} socket={socket} ></Chat>
              </div>
            ))}
          </div>
      </div>
    </>
  );

}

export default ChatList;


