const express = require("express");
const app = express();
const router = express.Router();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// db

const uri = 'mongodb://127.0.0.1:27017/chatapp_test_3';


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const chatroomSchema_test_3 = new mongoose.Schema({
  name: String,
  users: { type: Number, default: 0 },
  usernames: { type: [String], default: []}
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema_test_3);


// router

router.post('/chatrooms', async (req, res, next) => {
  try {
    // Create new chatroom in database
    const { name } = req.body;
    const chatroom = new Chatroom({ name });
    await chatroom.save();
    res.json(chatroom);
  } catch (err) {
    next(err);
  }
});

router.get('/chatrooms', async (req, res, next) => {
  try {
    // Retrieve list of chatrooms from database
    const chatrooms = await Chatroom.find({});
    res.json(chatrooms);
  } catch (err) {
    next(err);
  }
});


// middleware

app.use(express.json());
app.use(router);


// sockets 

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log('message from frontend', data)
    socket.to(data.room).emit("receive_message", data)
    console.log('message to room:', data.room)
  });

  socket.on("create_room", async(roomName) => {
    const chatroom = new Chatroom({name: roomName});
    await chatroom.save();
    console.log(`New chatroom created: ${roomName}`)
    io.emit("update_chatrooms", await Chatroom.find({}))
  })

  socket.on("join_room", async (data) => {
    const chatroom = await Chatroom.findOne({name: data.name});
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

      console.log('chatroom.users <= 1:', chatroom.users <= 1);
      if (chatroom.users <= 1) {
        socket.emit('joined_empty_room', {
          room: chatroom.name
        });
      }
      
      console.log(`user with Id: ${socket.id} joined room: ${chatroom.name} number of users ${chatroom.users}, names of users ${chatroom.usernames}`)
    }
  })
   
  socket.on("leave_room", async (roomName) => {
    console.log(roomName)
    socket.leave(roomName);

    const chatroom = await Chatroom.findOne({name: roomName});
    if (chatroom) {
      chatroom.users -= 1; 
      chatroom.usernames = chatroom.usernames.filter(username => username !== socket.id); 
      await chatroom.save();

      console.log(chatroom.name, chatroom.users, chatroom.usernames)

      io.emit("user_leaves", { 
        room: chatroom.name,
        username: socket.id,
        userCount: chatroom.users,
        usernames: chatroom.usernames,
      });

      console.log(`User with ID ${socket.id} left room ${chatroom.name}. Number of users: ${chatroom.users}`);

      if (chatroom.users === 0) {
        await Chatroom.deleteOne({_id: chatroom._id}); 

        console.log(`Chatroom ${chatroom.name} has been deleted.`);
        io.emit("update_chatrooms", await Chatroom.find({})); 
      }
    }
  });

  socket.on("disconnect", async () => {
    const chatrooms = await Chatroom.find({ usernames: socket.id });
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

      console.log(`User with ID ${socket.id} left room ${chatroom.name}. Number of users: ${chatroom.users}. Usernames: ${chatroom.usernames.join(", ")}`);
      
      if (chatroom.users === 0) {
        await Chatroom.deleteOne({_id: chatroom._id}); 

        console.log(`Chatroom ${chatroom.name} has been deleted.`);
        io.emit("update_chatrooms", await Chatroom.find({})); 
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });

});



// server 

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});


    // const chatrooms = await Chatroom.find({});
    // io.to(socket.id).emit("chatrooms_list", chatrooms);