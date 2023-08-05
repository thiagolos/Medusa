import * as io from "socket.io-client";
// import type { ServerToClientEvents, ClientToServerEvents } from './Types/SocketIo';

export const socket = io.connect("http://localhost:3001");

export function addSocketListener(event: string, arg: any) {
  socket.on(event, arg);
}

export function removeSocketListener(event: string) {
  socket.off(event);
}

export function socketEmit(eventName: string, arg: any) {
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