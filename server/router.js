import { Router } from "express";
import chatroomController from './controllers/chatroom.controller.js';

const router = new Router();

router.post('/chatrooms', chatroomController.createRoom);

router.get('/chatrooms', chatroomController.getRooms);

export default router;