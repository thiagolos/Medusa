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
  rooms: string[];
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