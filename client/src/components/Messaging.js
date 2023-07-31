import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../context/MessageContext";
import { ChatContext } from "../context/ChatContext";

function Chat({room, socket}) {

  const {setMessage, messageList, sendMessage} = useContext(MessageContext) 
  const {leaveRoom, chatrooms} = useContext(ChatContext) 

  const handleSendMessage = () => {
    sendMessage(room);
  };
  
  const handleLeaveRoom = () => {
    console.log('THE LEFT ROOM', room)
    leaveRoom(room);
  };

  const [colorMap, setColorMap] = useState({});
  const [color, setColor] = useState("#" + ((Math.random() * 0xffffff) << 0).toString(16)); // Define the color variable

  useEffect(() => {
    setColorMap((prevColorMap) => {
      return {
        ...prevColorMap,
        [socket.id]: color,
      };
    });
  }, [socket.id, color]);

  function getColor(sender) {
    if (!colorMap[sender]) {
      // Generate a random color for new users
      setColorMap((prevColorMap) => {
        return {
          ...prevColorMap,
          [sender]: getRandomColor(),
        };
      });
    }
    return colorMap[sender];
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  
  

  return (
    <>
      <div>
        <div className="ChatWindow">
          <button class="JoinButton" onClick={handleLeaveRoom}>Leave Room</button>
          {messageList
          .filter((messageContent) => messageContent.room === room)
           .map((messageContent) => (
            <div className={`Message ${messageContent.sender}`}>
            <div className="User_Time">
              {messageContent.sender === "me" ? "You" : `User with ID ${messageContent.socketId}`}, {messageContent.time}
            </div>
            <div className="MessageContent" style={{ color: getColor(messageContent.socketId) }}>{messageContent.message}</div>
            </div>
          ))}
          <div className="ChatInput">
            <input className="SelectorInput"
              placeholder="Message"
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            ></input>
            <button class="JoinButton" onClick={handleSendMessage}>Send Message</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;