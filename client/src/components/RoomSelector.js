import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import ChatList from "./ChatList"

function RoomSelector() {

  const {setRoom, joinRoom, setSelectorVisible, setSelectorClosed, isSelectorClosed, isSelectorVisible, handleBackgroundColor} = useContext(ChatContext) 

  const handleJoinRoom = () => {
    setSelectorVisible(false);
    setSelectorClosed(true)
    handleBackgroundColor()
    joinRoom();
 ;
  };

  const handleToggleSelector = () => {
    setSelectorVisible(!isSelectorVisible);
    setSelectorClosed(false);
  }

  return (
    <>
      {isSelectorVisible && !isSelectorClosed && (
        <div className="RoomSelector">
          
            <div>Hello, again!<br></br>Is there anything specific, you feel like talking about today?</div>
            <div className="SelectorInputAndButton">

              <input className="SelectorInput" type="text" placeholder="e.g. Japanese Food, Barbie, ..." onChange={(event)=>{
                setRoom(event.target.value);
              }}>
              </input>
              <button className="JoinButton" onClick={handleJoinRoom} >Join</button>
            </div>
            <div>Otherwise, feel free to inspire yourself among friends.</div>
        </div>
      )}
      {isSelectorClosed && (
        <div className="PlusButton">
          <button onClick={handleToggleSelector}>+</button>
        </div>
      )}
    </>
  );
}

export default RoomSelector;
