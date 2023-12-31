import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import router from "./router";
import socketInit from "./controllers/socket.controller";
import { ClientToServerEvents, ServerToClientEvents } from "./Types";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

export const server = http.createServer(app);

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: `http://localhost:5174`,
      methods: ["GET", "POST"],
    },
  },
);

io.on("connection", socketInit);


export default app;

