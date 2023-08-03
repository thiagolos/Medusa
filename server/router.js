import { Router } from "express";
import Chatroom from './models/chatroom.model.js';


const router = new Router();

router.post('/chatrooms', async (req, res, next) => {
  try {
    // Create new chatroom in database
    const { name } = req.body;
    const chatroom = new Chatroom({ name });
    await chatroom.save();
    res.json(chatroom);
  } catch (err) {
    next(err);
  }
});

router.get('/chatrooms', async (req, res, next) => {
  try {
    // Retrieve list of chatrooms from database
    const chatrooms = await Chatroom.find({});
    res.json(chatrooms);
  } catch (err) {
    next(err);
  }
});

export default router;