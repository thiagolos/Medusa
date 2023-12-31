import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./Types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3001"
);

export function addSocketListener<Event extends keyof ServerToClientEvents>(
  event: Event,
  arg: any
) {
  socket.on(event, arg);
}

export function removeSocketListener<Event extends keyof ServerToClientEvents>(
  event: Event
) {
  socket.off(event);
}

export function socketEmit<Event extends keyof ClientToServerEvents>(
  eventName: Event,
  ...args: Parameters<ClientToServerEvents[Event]>
) {
  socket.emit(eventName, ...args);
}

export function getAll() {
  const response = fetch("http://localhost:3001/chatrooms")
    .then(res => res.json())
    .catch(err => console.error(err));
  return response;
}

export default socket;
