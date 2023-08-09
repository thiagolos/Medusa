import {
  useContext,
  useEffect,
  useState,
  useRef,
  MouseEvent,
  FormEvent
} from "react";
import { MessageContext } from "../context/MessageContext";
import { ChatContext } from "../context/ChatContext";

function Chat({ roomName }: { roomName: string }) {
  const { leaveRoom, handleBackgroundColor, socket } = useContext(ChatContext);
  const { setMessage, messageList, sendMessage } = useContext(MessageContext);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  const [position, setPosition] = useState({ top: "-1000px", left: "-1000px" });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [colorMap, setColorMap] = useState({} as ColorMap);
  const [isDragging, setIsDragging] = useState(false);
  const [formInput, setFormInput] = useState("");
  const [color] = useState(
    "#" + ((Math.random() * 0xffffff) << 0).toString(16)
    ); 
    
  useEffect(() => {
    setColorMap(currentColorMap => {
      return {
        ...currentColorMap,
        [socket.id]: color
      };
    });
  }, [socket.id, color]);
  
  useEffect(() => {
    setPosition({ top: calculateTop(), left: calculateLeft() });
    messageInputRef.current!.focus()
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  // MESSAGE FUNCTIONALITY

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(roomName);
    const parentNode = (event.target as Element).parentNode;
    const input = parentNode!.querySelector("input");
    input!.value = "";
    setFormInput("");
  };

  const handleLeaveRoom = () => {
    handleBackgroundColor();
    leaveRoom(roomName);
  };

  // COLORS

  interface ColorMap {
    [k: string]: string;
  }
    
  function getColor(sender: string) {
    if (!colorMap[sender]) {
      setColorMap(prevColorMap => {
        return {
          ...prevColorMap,
          [sender]: getRandomColor()
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
    return value;
  }

  function calculateTop() {
    return `${Math.floor(Math.random() * (window.innerHeight - 300))}px`;
  }
  
  // MOUSE DRAG AND DROP
  
  function handleMouseDown(event: MouseEvent) {
    setIsDragging(true);
    setDragOffset({
      x: event.clientX - parseInt(position.left),
      y: event.clientY - parseInt(position.top)
    });
  }

  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      setPosition({
        left: event.clientX - dragOffset.x + "px",
        top: event.clientY - dragOffset.y + "px"
      });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        className="MessageContainer"
        style={{ position: "absolute", ...position }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="ChatBar">
          <div className="Room">{roomName}</div>
          <button className="LeaveButton" onClick={handleLeaveRoom}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </div>

        <div className="ChatWindow">
          <div className="MessageWrapper">
            {messageList
              .filter(messageContent => messageContent.room === roomName)
              .map((messageContent, i) => (
                <div key={i} className={`Message ${messageContent.sender}`}>
                  <div
                    className="User_Time"
                    style={{ color: getColor(messageContent.socketId) }}
                  >
                    {messageContent.sender === "me"
                      ? "You"
                      : `User ${messageContent.socketId.substring(0, 5)}`}
                    , {messageContent.time}
                  </div>

                  <div className="MessageContent">{messageContent.message}</div>
                  <div ref={messagesEndRef}></div>
                </div>
              ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="ChatInputWrapper"
            name="ChatInputWrapper"
          >
            <div className="ChatInput">
              <input
                ref={messageInputRef}
                className="MessageInput"
                name="MessageInput"
                type="text"
                value={formInput}
                onChange={event => {
                  const value = event.target.value;
                  setFormInput(value);
                  setMessage(event.target.value);
                }}
                autoComplete="off"
              ></input>
              <button className="SendButton" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chat;