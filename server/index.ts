import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import router from "./router";
import socketInit from "./controllers/socket.controller";
import { ClientToServerEvents, ServerToClientEvents } from "./Types";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(router);

const socketPort = 3001;

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: `http://localhost:3000`,
      methods: ["GET", "POST"],
    },
  },
);

io.on("connection", socketInit);

server.listen(socketPort, () => {
  console.log(`Server running on port: ${socketPort}`);
});
