import { Socket } from "socket.io-client";
export interface ClientToServerEvents {
  send_message: (messageData: MessageData) => void;
  create_room: (roomName: string) => void;
  join_room: (roomData: RoomData) => void;
  leave_room: (roomName: string) => void;
  disconnect: () => void;
  user_geht: (room: Room) => void;
}
export interface ServerToClientEvents {
  user_leaves: (room: Room) => void;
  user_join: (room: Room) => void;
  update_chatrooms: (database: Chatroom[]) => void;
  joined_empty_room: (roomName: string) => void;
  receive_message: (messageData: MessageData) => void;
  connect: () => void;
}
export interface Room {
  room?: string;
  username: string;
  userCount: number;
  usernames: string[];
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
  creator?: string;
}
export interface MessageData {
  user: string;
  room: string;
  message: string;
  time: string;
  sender?: string;
  socketId: string;
}
export interface Position {
  top: number;
  left: number;
}
export interface ChatContext {
  roomData: RoomData;
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  chatrooms: Chatroom[];
  setChatrooms: React.Dispatch<React.SetStateAction<Chatroom[]>>;
  getAll: () => Promise<Chatroom[]>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  userCount: number;
  setUserCount: React.Dispatch<React.SetStateAction<number>>;
  joinRoom: (room: string) => void;
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

export interface MessageContext {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messageList: MessageData[];
  setMessageList: React.Dispatch<React.SetStateAction<MessageData[]>>;
  sendMessage: (roomName: string) => Promise<void>;
  handleRoomButtonClick: (roomName: string) => void;
}
