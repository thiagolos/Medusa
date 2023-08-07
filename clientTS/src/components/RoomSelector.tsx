import { FormEvent, useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";

function RoomSelector() {

  const { room, setRoom, joinRoom, setSelectorVisible, setSelectorClosed, isSelectorClosed, isSelectorVisible, handleBackgroundColor} = useContext(ChatContext)
  const [formInput, setFormInput] = useState('')

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    setSelectorVisible(false);
    setSelectorClosed(true)
    handleBackgroundColor()
    joinRoom(room);
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
                  setRoom(event.target.value);
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
