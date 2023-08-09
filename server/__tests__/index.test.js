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
    server.listen(3001, () => {
      console.log(`Test server running on port: 3001`);
      clientSocket = new Client(`http://localhost:3001`);
      clientSocket.on("connect", () => {
        console.log("Client connected");
    });
    });
  });

  beforeEach(async () => {
    await Chatroom.deleteMany({});
  });

  afterAll(async () => {
    await Chatroom.collection.drop();
    mongoose.connection.close();
    clientSocket.close();
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

  test("should create room", (done) => {
    clientSocket.emit("create_room", "testRoom");
    clientSocket.on("update_chatrooms", (response) => {
      expect(response.length).toBe(1);
      done();
    });
  });

  // it("should join a room, or create one if it does not exist", (done) => {
  //   const testRoom = {
  //     name: "test room",
  //     time:
  //       new Date(Date.now()).getHours() +
  //       ":" +
  //       new Date(Date.now()).getMinutes(),
  //     creator: "testerman",
  //   };
  //   serverSocket.on("create_room", async (roomName) => {
  //     expect(roomName).toBe(testRoom.name);

  //     dbModels.addOrUpdate(roomName);
  //     let response = await request.get("/chatrooms");
  //     expect(JSON.parse(response.text).length).toBe(1);

  //     io.emit("update_chatrooms", await dbModels.getAll());
  //     done();
  //   });
  //   clientSocket.emit("create_room", testRoom.name);
  // });
});
