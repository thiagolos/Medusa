import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { MessageContext } from "../context/MessageContext";
import ChatList from "./ChatList";
import Chat from './Messaging'

function RoomList() {
  const { chatrooms } = useContext(ChatContext);
  const { handleRoomButtonClick } = useContext(MessageContext);

  return (
    <>
      <div>
        <h2>List of Chatrooms:</h2>
        <ul>
          {chatrooms.map((chatroom) => {
            const roomName = chatroom.name; // Store the chatroom name in a separate variable
            return (
              <button
                key={chatroom._id}
                onClick={() => handleRoomButtonClick(roomName)}
              >
                name: 
                {chatroom.name},
                users:
                {chatroom.users}
              </button>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default RoomList;