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
      <div className="AllRoomLists">

        <div className="RoomListTop">
          <div>
            {chatrooms.map((chatroom) => {
              const roomName = chatroom.name; // Store the chatroom name in a separate variable
              return (
                <button className="RoomButton"
                  key={chatroom._id}
                  onClick={() => handleRoomButtonClick(roomName)}
                >
                  {/* name:  */}
                  {chatroom.name}
                  {/* users:
                  {chatroom.users} */}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* <div className="Logo">
            <h2>MEDUSA</h2>
      </div> */}

    </>
  );
}

export default RoomList;


