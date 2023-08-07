import dbModels from "../models/chatroom.model.js";
import { io } from "../index.js";

const socketInit = function (socket) {

  socket.on("send_message", (data) => {
    console.log(`me bitch: ${data}`);
    socket.to(data.room).emit("receive_message", data)
  });

  socket.on("create_room", async(roomName) => {
    dbModels.addOrUpdate(roomName);
    io.emit("update_chatrooms", await dbModels.getAll())
  })

  socket.on("join_room", async (data) => {
    const chatroom = await dbModels.getOne(data.name);

    if (chatroom) {
      socket.join(chatroom.name);
      chatroom.users += 1;
      chatroom.usernames.push(socket.id)
      await chatroom.save();

      io.emit("user_join", {
        room: chatroom.name,
        username: socket.id,
        userCount: chatroom.users,
        usernames: chatroom.usernames,
      });

      if (chatroom.users <= 1) {
        socket.emit('joined_empty_room', {
          room: chatroom.name
        });
      }
    }
  })

  socket.on("leave_room", async (roomName) => {
    socket.leave(roomName);
    const chatroom = await dbModels.getOne(roomName);
    console.log(`thisss=> ${chatroom}`);
    if (chatroom) {
      chatroom.users -= 1;
      chatroom.usernames = chatroom.usernames.filter(username => username !== socket.id);
      await chatroom.save();

      io.emit("user_leaves", {
        room: chatroom.name,
        username: socket.id,
        userCount: chatroom.users,
        usernames: chatroom.usernames,
      });

      if (chatroom.users === 0) {
        await dbModels.removeOne(chatroom._id);
        io.emit("update_chatrooms", await dbModels.getAll());
      }
    }
  });

  socket.on("disconnect", async () => {
    const chatrooms = await dbModels.getMany(socket.id);

    for (const chatroom of chatrooms) {
      chatroom.users -= 1;
      chatroom.usernames = chatroom.usernames.filter(username => username !== socket.id);
      await chatroom.save();

      io.to(chatroom.name).emit("user_geht", {
        room: chatroom.name,
        username: socket.id,
        userCount: chatroom.users,
        usernames: chatroom.usernames,
      });

      if (chatroom.users === 0) {
        await dbModels.removeOne(chatroom._id);
        io.emit("update_chatrooms", await dbModels.getAll());
      }
    }
  });
};

export default socketInit;
