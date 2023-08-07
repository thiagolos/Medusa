export interface User {
  socketId: string;
  rooms: Room[];
}

export interface Room {
  name: string;
  time: string;
}

export interface Chatroom {
  _id?: string;
  name: string;
  users: number;
  usernames: srting[];
}
export interface Position {
  top: number;
  left: number;
}

export interface ChatContext {
  roomData: {
    name: string;
    time: string;
    creator: string;
  };
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  chatrooms: Chatroom[];
  setChatrooms: React.Dispatch<React.SetStateAction<Chatroom[]>>;
  getAll: () => Promise<any>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  userCount: number;
  setUserCount: React.Dispatch<React.SetStateAction<number>>;
  
}