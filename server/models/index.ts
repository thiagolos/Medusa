import mongoose from "mongoose";

const uri = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;

mongoose.connect(uri);

export default mongoose;
