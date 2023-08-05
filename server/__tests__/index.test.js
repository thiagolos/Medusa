import express from 'express';
import router from '../router.js';
import supertest from 'supertest';
import dbModels from '../models/chatroom.model.js'
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

const Chatroom = dbModels.Chatroom;
const databaseName = 'test';

describe ('Integration tests', () => {
  let io, serverSocket, clientSocket;
  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    const httpServer = createServer(app);
    io = new Server(httpServer);
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", () => {
        console.log('Client connected');
      });
    });
  });

  beforeEach(async () => {
    await Chatroom.deleteMany({});
  });

  afterAll(async () => {
    await Chatroom.collection.drop();
    mongoose.connection.close();
    io.close();
    clientSocket.close();
  });

  it('should create chatrooms, and retreive them from the database', async () => {
    let response = await request.get('/chatrooms');
    expect(JSON.parse(response.text).length).toBe(0);

    await request.post('/chatrooms').send('test room 1');
    response = await request.get('/chatrooms');
    expect(JSON.parse(response.text).length).toBe(1);

    await request.post('/chatrooms').send('test room 2');
    response = await request.get('/chatrooms');
    expect(JSON.parse(response.text).length).toBe(2);
  })

  test("should establish socket connection", (done) => {
    clientSocket.on("test", (arg) => {
      expect(arg).toBe("works");
      done();
    });
    serverSocket.emit("test", "works");
  });

  it("should join a room, or create one if it does not exist", (done) => {
    const testRoom = {
      name: "test room",
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      creator: "testerman"
    }
    serverSocket.on("create_room", async(roomName) => {

      expect(roomName).toBe(testRoom.name);

      dbModels.addOrUpdate(roomName);
      let response = await request.get('/chatrooms');
      expect(JSON.parse(response.text).length).toBe(1);


      io.emit("update_chatrooms", await dbModels.getAll())
      done();
    })
    clientSocket.emit("create_room", testRoom.name);
  });
});
