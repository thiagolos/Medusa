import express, { Router } from "express";
import chatroomController from "./controllers/chatroom.controller";

const router: Router = express.Router();

router.post("/chatrooms", chatroomController.createRoom);

router.get("/chatrooms", chatroomController.getRooms);

export default router;
