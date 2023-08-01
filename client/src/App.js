import "./index.css";
import RoomList from "./components/RoomList";
import RoomSelector from "./components/RoomSelector";
import ChatList from "./components/ChatList";

function App() {

  return (
    <>
      <div className="App">
        <RoomList></RoomList>
        <RoomSelector></RoomSelector>
      </div>
      <ChatList></ChatList>
    </>


  );

}

export default App;
