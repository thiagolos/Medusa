import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import ChatList from "./ChatList"

function RoomSelector() {

  const {setRoom, joinRoom,} = useContext(ChatContext) 

  const handleJoinRoom = () => {
    joinRoom();
  };

  return (
    <>
      <h1>Room Selector</h1>
      <div>
        <input placeholder="Room" onChange={(event)=>{
          setRoom(event.target.value);
        }}></input>
        <button onClick={handleJoinRoom} >Join an existing room with entering its name or create a non-existing Room</button>
      </div>
      <ChatList></ChatList>
    </>
  );
}

export default RoomSelector;
