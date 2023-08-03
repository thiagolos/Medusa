import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import router from './router';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(router);

const port = 3000;

export const io = new Server(server, {
  cors: {
    origin: `http://localhost:${port}`,
    methods: ["GET", "POST"],
  },
});

server.listen(3001, () => {
  console.log(`Server running on port: ${port}`);
});


