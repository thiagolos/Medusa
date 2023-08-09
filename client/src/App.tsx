import "./index.css";
import RoomList from "./components/RoomList";
import RoomSelector from "./components/RoomSelector";
import ChatList from "./components/ChatList";
import Marquee from "react-fast-marquee";
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";

function App() {

  const {bgColor}= useContext(ChatContext);

  return (
    <>
      <div className="App" style={{ backgroundColor: bgColor }}>
        <div className="room-list-container">
          <div
            className="RoomListMarquee"
            style={{ background: "rgb(182,182,182)", color: "rgb(15,11,39)" }}
          >
            <Marquee pauseOnHover={true} speed={50}>
              <RoomList></RoomList>
            </Marquee>
            <Marquee pauseOnHover={true} speed={25}>
              <RoomList></RoomList>
            </Marquee>
          </div>
        </div>
        <RoomSelector></RoomSelector>
      </div>
      <ChatList></ChatList>
    </>
  );
}

export default App;