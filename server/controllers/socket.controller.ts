import dbModels from "../models/chatroom.model";
import { ClientToServerEvents, ServerToClientEvents } from "../Types";
import { Socket } from "socket.io";
import { io } from "../index";

const socketInit = function (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
) {
  socket.on("send_message", (messageData) => {
    socket.to(messageData.room).emit("receive_message", messageData);
  });

  socket.on("create_room", async (roomName) => {
    dbModels.addOrUpdate(roomName);
    io.emit("update_chatrooms", await dbModels.getAll());
  });

  socket.on("join_room", async (roomData) => {
    const chatroom = await dbModels.getOne(roomData.name);

    if (chatroom) {
      socket.join(chatroom.name!);
      chatroom.users += 1;
      chatroom.usernames.push(socket.id);
      await chatroom.save();

      io.emit("user_join", {
        room: chatroom.name,
        username: socket.id,
        userCount: chatroom.users,
        usernames: chatroom.usernames,
      });

      if (chatroom.users <= 1) {
        if (chatroom.name) {
          socket.emit("joined_empty_room", chatroom.name);
        }
      }
    }
  });

  socket.on("leave_room", async (roomName) => {
    socket.leave(roomName);
    const chatroom = await dbModels.getOne(roomName);
    if (chatroom) {
      chatroom.users -= 1;
      chatroom.usernames = chatroom.usernames.filter(
        (username) => username !== socket.id,
      );
      await chatroom.save();

      io.emit("user_leaves", {
        room: chatroom.name,
        username: socket.id,
        userCount: chatroom.users,
        usernames: chatroom.usernames,
      });

      if (chatroom.users <= 0) {
        await dbModels.removeOne(chatroom._id.toString());
        io.emit("update_chatrooms", await dbModels.getAll());
      }
    }
  });

  socket.on("disconnect", async () => {
    const chatrooms = await dbModels.getMany(socket.id);

    if (chatrooms) {
      for (const chatroom of chatrooms) {
        chatroom.users -= 1;
        chatroom.usernames = chatroom.usernames.filter(
          (username) => username !== socket.id,
        );
        await chatroom.save();

        io.to(chatroom.name!).emit("user_get", {
          room: chatroom.name,
          username: socket.id,
          userCount: chatroom.users,
          usernames: chatroom.usernames,
        });

        if (chatroom.users === 0) {
          await dbModels.removeOne(chatroom._id.toString());
          io.emit("update_chatrooms", await dbModels.getAll());
        }
      }
    }
  });
};

export default socketInit;
