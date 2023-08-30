import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;
const uri = `mongodb://127.0.0.1:27017/${env.DB_NAME}`;

mongoose.connect(uri);

export default mongoose;
