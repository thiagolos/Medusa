import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { MessageContext } from "../context/MessageContext";

function RoomList() {
  const {
    chatrooms,
    setSelectorClosed,
    setSelectorVisible,
    handleBackgroundColor
  } = useContext(ChatContext);
  const { handleRoomButtonClick } = useContext(MessageContext);

  const handleButtonClick = (roomName: string) => {
    handleRoomButtonClick(roomName);
    toggleSelector();
    handleBackgroundColor();
  };

  const toggleSelector = () => {
    setSelectorVisible(false);
    setSelectorClosed(true);
  };

  return (
    <>
      <div className="RoomList">
        <div>
          {chatrooms.map(chatroom => {
            const roomName = chatroom.name;
            return (
              <button
                className="RoomButton"
                key={chatroom._id}
                onClick={() => handleButtonClick(roomName)}
              >
                {chatroom.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default RoomList;
