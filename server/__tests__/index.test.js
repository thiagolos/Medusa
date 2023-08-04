import express from 'express';
import router from '../router';
import supertest from 'supertest';
import dbModels from '../models/chatroom.model'
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

const Chatroom = dbModels.Chatroom;
const databaseName = 'test';

describe ('Integration tests', () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await Chatroom.collection.drop();
    mongoose.connection.close();
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
});

describe ('Socket tests', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should establish socket connection", (done) => {
    clientSocket.on("test", (arg) => {
      expect(arg).toBe("works");
      done();
    });
    serverSocket.emit("test", "works");
  });
});