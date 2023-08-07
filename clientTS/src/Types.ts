import { Socket } from "socket.io-client";
export interface ClientToServerEvents {
  update_chatrooms: (database: Chatroom[]) => void;
  send_message: (messageData: MessageData) => void;
  create_room: (roomName: string) => void;
  join_room: (roomData: RoomData) => void;
  leave_room: (roomName: string) => void;
  disconnect: () => void;
  user_geht: (room:Room) => void;
  user_join: (room: Room) => void;
  user_leaves: (room:Room) => void;

}
export interface ServerToClientEvents {
  joined_empty_room: (roomName: string) => void;
  receive_message: (messageData: MessageData) => void;
}
export interface Room {
  room?: string,
  username: string,
  userCount: number,
  usernames: string[]
}
export interface User {
  socketId: string;
  rooms: RoomData[];
}
export interface Chatroom {
  _id?: string;
  name: string;
  users: number;
  usernames: string[];
}
export interface RoomData {
  name: string;
  time: string;
  creator: string;
}
export interface MessageData {
  user: string;
  room: string;
  message: string;
  time: string;
  socketId: string;
}
export interface Position {
  top: number;
  left: number;
}
export interface ChatContext {
  roomData: RoomData;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  chatrooms: Chatroom[];
  setChatrooms: React.Dispatch<React.SetStateAction<Chatroom[]>>;
  getAll: () => Promise<any>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  userCount: number;
  setUserCount: React.Dispatch<React.SetStateAction<number>>;
  joinRoom: (roomData: RoomData) => void;
  leaveRoom: (roomName: string) => void;
  roomLists: User[];
  setRoomLists: React.Dispatch<React.SetStateAction<User[]>>;
  positions: Position[];
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
  setSelectorClosed: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isSelectorClosed: boolean;
  isSelectorVisible: boolean;
  colors: string[];
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  handleBackgroundColor: () => void;
}