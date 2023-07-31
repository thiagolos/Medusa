import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { MessageContext } from "../context/MessageContext";


function RoomList() {
  const { chatrooms, setSelectorClosed,setSelectorVisible } = useContext(ChatContext);
  const { handleRoomButtonClick } = useContext(MessageContext);


  const handleButtonClick = (roomName) => {
    handleRoomButtonClick(roomName); // Call the existing function
    secondFunction(roomName); // Call the second function
  };

  const secondFunction = () => {
    setSelectorVisible(false);
    setSelectorClosed(true);
  };


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
                  onClick={() => handleButtonClick(roomName)}
                >
                  {chatroom.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </>
  );
}

export default RoomList;


