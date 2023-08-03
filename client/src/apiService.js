import io from "socket.io-client";

export const socket = io.connect("http://localhost:3001");

export function addSocketListener(event, arg) {
  socket.on(event, arg);
}

export function removeSocketListener(event) {
  socket.off(event);
}

export function socketEmit(eventName, ...args) {
  socket.emit(eventName, ...args);
}

export function getAll () {
  return fetch('http://localhost:3001/chatrooms')
  .then((res) => res.json())
  .catch((err) => console.error(err));
}

export default socket;