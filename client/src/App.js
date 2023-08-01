import "./index.css";
import Chat from "./components/Messaging";
import RoomList from "./components/RoomList";
import RoomSelector from "./components/RoomSelector";
import { useContext, useState } from "react";
import { ChatContext } from "./context/ChatContext";

function App() {

  return (
    <>
      <div className="App">
        <RoomList></RoomList>
        <RoomSelector></RoomSelector>
      </div>
    </>


  );

}

export default App;
