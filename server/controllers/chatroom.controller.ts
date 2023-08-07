import { Request, Response } from "express";
import databaseModels from "../models/chatroom.model";

const createRoom = async (req: Request, res: Response) => {
  try {
    const response = await databaseModels.postOne(req.body.name);
    res.status(201).send(response);
  } catch (err) {
    console.log("Failed to create room: ", err);
  }
};

const getRooms = async (req: Request, res: Response) => {
  try {
    const response = await databaseModels.getAll();
    res.status(200).send(response);
  } catch (err) {
    console.log("Failed to get rooms: ", err);
  }
};

export default {
  createRoom,
  getRooms,
};
