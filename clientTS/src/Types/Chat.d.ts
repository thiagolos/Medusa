export interface User {
  socketId: string;
  rooms: Room[];
}

export interface Room {
  name: string,
  time: string
}