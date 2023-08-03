import mongoose from './index.js';

const chatroomSchema_test_6 = new mongoose.Schema({
  name: String,
  users: { type: Number, default: 0 },
  usernames: { type: [String], default: []}
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema_test_6);

export default Chatroom;