import mongoose from './index.js';

const chatroomSchema_test_6 = new mongoose.Schema({
  name: String,
  users: { type: Number, default: 0 },
  usernames: { type: [String], default: []}
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema_test_6);

const postOne = async (room) => {
  try {
    const response = await Chatroom.create(room);
    return response;
  } catch (err) {
    console.log("Unable to create database entry::",err);
  }
}

const getAll = async () => {
  try {
    const response = await Chatroom.find({});
    return response;
  } catch (err) {
    console.log("Unable to get entries from database::",err);
  }
}

const getMany = async (user) => {
  try {
    const response = await Chatroom.find({usernames: user});
    return response;
  } catch (err) {
    console.log ("Unable to find rooms::",err);
  }
}

const getOne = async (roomName) => {
  try {
    const response = await Chatroom.findOne({name: roomName});
    return response;
  } catch (err) {
    console.log("Unable to find room::",err);
  }
}

const addOrUpdate = async (roomName) => {
  try {
    const chatroom = new Chatroom({name: roomName});
    await chatroom.save();
  } catch (err) {
    console.log("Unable to create/update room::",err);
  }
}

const removeOne = async (roomId) => {
  try {
    const response = await Chatroom.deleteOne({_id: roomId})
  } catch (err) {
    console.log("Unable to delete room::",err);
  }
}

export default {
  Chatroom,
  getAll,
  getMany,
  getOne,
  addOrUpdate,
  postOne,
  removeOne,
}