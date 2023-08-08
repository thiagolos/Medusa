import { FormEvent, useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";

function RoomSelector() {

  const { roomName, setRoomName, joinRoom, setSelectorVisible, setSelectorClosed, isSelectorClosed, isSelectorVisible, handleBackgroundColor} = useContext(ChatContext)
  const [formInput, setFormInput] = useState('')

  const handleJoinRoom = (e: FormEvent) => {
    console.log("FORM INPUT: ", formInput);
    // console.log("FORM EVENT: ", e);
    e.preventDefault();
    setSelectorVisible(false);
    setSelectorClosed(true)
    handleBackgroundColor()
    console.log(roomName);
    console.log(roomName);
    joinRoom(roomName);
    setFormInput('');
  };

  const handleToggleSelector = () => {
    setSelectorVisible(!isSelectorVisible);
    setSelectorClosed(false);
  }

  return (
    <>
      {isSelectorVisible && !isSelectorClosed && (
        <div className="RoomSelector">

            <div>Hello, again!<br/>Is there anything specific, you feel like talking about today?</div>
            <form
              onSubmit={handleJoinRoom}
              className="SelectorInputAndButton"
              name="SelectorInputAndButton"
            >

              <input
                className="SelectorInput"
                name="SelectorInput"
                type="text"
                placeholder="e.g. Japanese Food, Barbie, ..."
                value={formInput}
                onChange={(event)=>{
                  setFormInput(event.target.value);
                  setRoomName(formInput);
                }}
                autoComplete="off"
              >
              </input>
              <button
                className="JoinButton"
              >
              Join</button>
            </form>
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
