import "./index.css";
import RoomList from "./components/RoomList";
import RoomSelector from "./components/RoomSelector";
import ChatList from "./components/ChatList";
import Marquee from "react-fast-marquee"
import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";

function App() {

  const {chatrooms} = useContext(ChatContext)

  const slicedRooms= chatrooms.slice(0,2)

  return (
    <>
      <div className="App">
        <Marquee>
        <RoomList></RoomList>
        </Marquee>
        <RoomSelector></RoomSelector>
      </div>
      <ChatList></ChatList>
    </>


  );

}

export default App;
