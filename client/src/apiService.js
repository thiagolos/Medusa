import io from "socket.io-client";
// import type { ServerToClientEvents, ClientToServerEvents } from './Types/SocketIo';

export const socket = io.connect("http://localhost:3001");

export function addSocketListener(event, arg) {
  socket.on(event, arg);
}

export function removeSocketListener(event) {
  socket.off(event);
}

export function socketEmit(eventName, arg) {
  socket.emit(eventName, arg);
}

export function getAll () {
  const response = fetch('http://localhost:3001/chatrooms')
    .then((res) => res.json())
    .catch((err) => console.error(err));
  console.log(response);
  return response;
}

export default socket;