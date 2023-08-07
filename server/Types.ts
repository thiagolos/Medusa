
export interface ClientToServerEvents {
  receive_message: (messageData: MessageData) => void;
  joined_empty_room: (roomName: string) => void;
}

export interface ServerToClientEvents {
  update_chatrooms: (database: Chatroom[]) => void;
  send_message: (messageData: MessageData) => void;
  join_room: (roomData: RoomData) => void;
  create_room: (roomName: string) => void;
  leave_room: (roomName: string) => void;
  disconnect: () => void;
  user_geht: (room:Room) => void;
  user_join: (room: Room) => void;
  user_leaves: (room:Room) => void;
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