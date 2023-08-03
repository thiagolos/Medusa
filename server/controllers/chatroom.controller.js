import Chatroom from "../models/chatroom.model.js";

const createRoom = async (req, res) => {
  try {
    const response = await Chatroom.create(req.body.name);
    res.status(201).send(response); 
    return response;
  } catch (err) {
    console.log("Failed to create room: ", err);
  }
}

const getRooms = async (req, res) => {
  try {
    const response = await Chatroom.find({})
    res.status(200).send(response);
    return response;
  } catch (err) {
    console.log("Failed to get rooms: ", err);
  }
}

export default {
  createRoom,
  getRooms
}