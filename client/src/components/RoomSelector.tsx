import { FormEvent, useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";


function RoomSelector() {

  const { roomName, setRoomName, joinRoom, setSelectorVisible, setSelectorClosed, isSelectorClosed, isSelectorVisible, handleBackgroundColor} = useContext(ChatContext)
  const [formInput, setFormInput] = useState('')

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!formInput){
      return;
    }
    setSelectorVisible(false);
    setSelectorClosed(true)
    handleBackgroundColor()
    joinRoom(roomName);
    setFormInput('');
  };

  const handleToggleSelector = () => {
    setSelectorVisible(!isSelectorVisible);
    setSelectorClosed(false);
  }

  const selectorInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    selectorInputRef.current!.focus()
  }, []);


  return (
    <>
      {isSelectorVisible && !isSelectorClosed && (
        <div className="RoomSelector">

            <div>Hello, again!<br/>Is there anything specific, you feel like talking about today?</div>
            <form 
              onSubmit={handleJoinRoom}
              className="SelectorInputAndButton"
              name="SelectorInputAndButton"
              noValidate
            >
              <input
                ref={selectorInputRef}
                className="SelectorInput"
                name="SelectorInput"
                id="SelectorInput"
                type="text"
                placeholder="e.g. Japanese Food, Barbie, ..."
                value={formInput}
                onChange={(event)=>{
                  const value = event.target.value;
                  setFormInput(value);
                  setRoomName(value.split(" ").map((word) => {
                    if (word[0]){
                      return word[0].toUpperCase() + word.substring(1).toLowerCase();
                    }
                }).join(" "));
                }}
                autoComplete="off"
                required
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
