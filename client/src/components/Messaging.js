import { useContext, useEffect, useState, useRef } from "react";
import { MessageContext } from "../context/MessageContext";
import { ChatContext } from "../context/ChatContext";

function Chat({room, socket}) {

  const {setMessage, messageList, sendMessage, message} = useContext(MessageContext);
  const {leaveRoom, handleBackgroundColor} = useContext(ChatContext);

  // MESSAGE FUNCTIONALITY 

  const handleSendMessage = (e) => {
    sendMessage(room);
    const parentNode = e.target.parentNode;
    const input = parentNode.querySelector('input');
    input.value = '';
  };
  
  const handleLeaveRoom = () => {
    handleBackgroundColor()
    leaveRoom(room);
  };

  // COLORS 

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

   // POSITIONING 

  function calculateLeft() {
    const value = `${Math.floor(Math.random() * (window.innerWidth - 300))}px`;
    console.log('VALEU', value)
    return value;
  }

  function calculateTop() {
    return `${Math.floor(Math.random() * (window.innerHeight - 300))}px`;
  }

  const [position, setPosition] = useState({ top: "-1000px", left: "-1000px" });

  useEffect(() => {
    setPosition({ top: calculateTop(), left: calculateLeft() });
  }, []);

  // MOUSE DRAG AND DROP

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  function handleMouseDown(event) {
    setIsDragging(true);
    setDragOffset({
      x: event.clientX - parseInt(position.left),
      y: event.clientY - parseInt(position.top),
    });
  }

  function handleMouseMove(event) {
    if (isDragging) {
      setPosition({
        left: event.clientX - dragOffset.x + "px",
        top: event.clientY - dragOffset.y + "px",
      });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(()=>{
    scrollToBottom()
  }, [messageList])


  return (
    <>
      <div className="MessageContainer" style={{ position: "absolute", ...position }} onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>

          <div className="ChatBar">
            <div className="Room">{room}</div>
            <button class="LeaveButton" onClick={handleLeaveRoom}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
          </div>

          <div className="ChatWindow" >
            <div className="MessageWrapper">
            {messageList
              .filter((messageContent) => messageContent.room === room)
              .map((messageContent) => (
                <div className={`Message ${messageContent.sender}`}>

                  <div className="User_Time" style={{ color: getColor(messageContent.socketId) }}>
                    {messageContent.sender === "me" ? "You" : `User ${messageContent.socketId.substring(0, 5)}`}, {messageContent.time}
                  </div>

                  <div className="MessageContent">{messageContent.message}
                  </div>
                  <div ref={messagesEndRef}></div>

                </div>
            ))}
            </div>

                <div className="ChatInputWrapper">
                  <div className="ChatInput">
                    <input className="MessageInput" type="text"
                      onChange={(event) => {
                        setMessage(event.target.value);
                      }}>
                    </input>
                    <button class="SendButton" onClick={handleSendMessage}>Send</button>
                  </div>
                </div>
               
          
          </div>

      </div>
    </>
  );
}

export default Chat;