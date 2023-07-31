import Chat from "./Messaging";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

function ChatList() {

  const { roomLists, socket, room, leaveRoom } = useContext(ChatContext);

  const index = roomLists.findIndex((list) => list.socketId === socket.id);

  if (index === -1) {
    return 
  }




  // const handleLeaveRoom = () => {
  //   console.log('THE LEFT ROOM', room)
  //   leaveRoom(room);
  // };

  return (
    <>
        <div>
              {roomLists[index].rooms.map((room) => (
                <div className="ChatList" key={room.name}>
                  <Chat room={room.name} socket={socket} ></Chat>
                </div>
              ))}
        </div>
    </>
  );

}

export default ChatList;


