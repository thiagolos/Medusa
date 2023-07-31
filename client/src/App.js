import "./index.css";
import Chat from "./components/Messaging";
import RoomList from "./components/RoomList";
import RoomSelector from "./components/RoomSelector";
import ChatList from "./components/ChatList";

function App() {

  return (
    <>
      <div>
        <RoomList></RoomList>
        <RoomSelector></RoomSelector>
      </div>
    </>


  );

}

export default App;
