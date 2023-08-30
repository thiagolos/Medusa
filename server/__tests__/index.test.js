/* eslint-disable */
import supertest from "supertest";
import dbModels from "../models/chatroom.model.ts";
import mongoose from "mongoose";
import Client from "socket.io-client";
import app, { server } from '../index'

const Chatroom = dbModels.Chatroom;
const databaseName = "test";

describe("Integration tests", () => {
  let clientSocket;
  const request = supertest(app);

  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  });
  
  beforeEach(async () => {
    server.listen(3001, () => {
      console.log(`Test server running on port: 3001`);
      clientSocket = new Client(`http://localhost:3001`);
      clientSocket.on("connect", () => {
        console.log("Client connected");
      });
    });
    await Chatroom.deleteMany({});
  });

  afterEach(async () => {
    await clientSocket.close();
    server.close();
  })

  afterAll(async () => {
    await Chatroom.collection.drop();
    mongoose.connection.close();
  });

  it("should create chatrooms, and retreive them from the database", async () => {
    let response = await request.get("/chatrooms");
    expect(JSON.parse(response.text).length).toBe(0);

    await request.post("/chatrooms").send("test room 1");
    response = await request.get("/chatrooms");
    expect(JSON.parse(response.text).length).toBe(1);

    await request.post("/chatrooms").send("test room 2");
    response = await request.get("/chatrooms");
    expect(JSON.parse(response.text).length).toBe(2);
  });

  test("should create and join room", (done) => {
    clientSocket.emit("create_room", "testRoom");
    let testRoom;
    clientSocket.on("update_chatrooms", (response) => {
      testRoom = response[0];
      expect(response.length).toBe(1);

      clientSocket.emit("join_room", testRoom);
      clientSocket.on("user_join", (response) => {
        expect(response.userCount).toBe(1);
        done();
      });
    });
  });
  
  test("should delete room when last user leaves", (done) => {
    clientSocket.emit("create_room", "testRoom");
    let testRoom;

    clientSocket.on("update_chatrooms", (response) => {
      clientSocket.off("update_chatrooms");
      testRoom = response[0];
      clientSocket.emit("join_room", testRoom);
      
      clientSocket.on("user_join", () => {
        clientSocket.emit('leave_room', "testRoom")
        
        clientSocket.on('user_leaves', (response) => {
          expect(response.userCount).toBe(0)
          
          clientSocket.on("update_chatrooms", (response) => {
            expect(response.length).toBe(0);
            done();
          });
        });
      });
    });
  });
});
