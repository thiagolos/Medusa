
export interface ClientToServerEvents {
  update_chatrooms: () => Promise<any>;
  user_join: Room;
  joined_empty_room: {
    room: string
  };
  receive_message: Data;
  user_leaves: Room;
  user_geht: Room;
}

export interface ServerToClientEvents {
  send_message: (data: Data) => void;
  create_room: (roomName: string) => void;
  join_room: (data: Data) => void;
  leave_room: (roomName: string) => void;
  disconnect: () => void;
}

interface Room {
  room: string,
  username: string,
  userCount: number,
  usernames: number
}

interface Data {
  'message sent': {
    user: string,
    room: string,
    message: string,
    time: string,
    sender: string,
    socketId: string
  }
}