import Chat from "./Messaging";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

function ChatList() {

  const { roomLists, socket } = useContext(ChatContext);

  const index = roomLists.findIndex((list) => list.socketId === socket.id);

  if (index === -1) {
    return <p>You haven't joined any rooms yet.</p>;
  }

  return (
    <>
      <div className="ChatList">
      <h1>ChatList</h1>
      <ul>
        {roomLists[index].rooms.map((room) => (
          <li key={room.name}>
            {room.name} - {room.time}
            <Chat room={room.name} socket={socket} ></Chat>
          </li>
        ))}
      </ul>
      <div>
      </div>
      </div>
    </>
  );

}

export default ChatList;


