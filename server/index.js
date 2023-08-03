import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import router from './router.js';
import socketIoInit from "./controllers/socket.controller.js";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(router);

const expressPORT = 3001

export const io = new Server(server, {
  cors: {
    origin: `http://localhost:${expressPORT}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", socketIoInit);


server.listen(3001, () => {
  console.log(`Server running on port: ${expressPORT}`);
});


