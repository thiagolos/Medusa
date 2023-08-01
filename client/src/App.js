import "./index.css";
import RoomList from "./components/RoomList";
import RoomSelector from "./components/RoomSelector";
import ChatList from "./components/ChatList";
import Marquee from "react-fast-marquee"
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";

function App() {

  return (
    <>
      <div className="App">
        <div className="room-list-container">
          <div className="RoomListMarquee" style={{ background: 'rgb(182,182,182)', color: 'rgb(15,11,39)'}}>
            <Marquee speed={30}>
            <RoomList></RoomList>
            </Marquee>
            <Marquee speed={15}>
            <RoomList></RoomList>
            </Marquee>
          </div>
        </div>
        <RoomSelector></RoomSelector>
      </div>
      <ChatList></ChatList>
      {/* <div className="page-border"></div> */}
    </>


  );

}

export default App;
