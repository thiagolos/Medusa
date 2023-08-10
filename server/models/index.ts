import mongoose from "mongoose";

const uri = "mongodb://127.0.0.1:27017/chatapp";

mongoose.connect(uri);

export default mongoose;
