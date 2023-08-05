import mongoose from 'mongoose';

const uri = 'mongodb://127.0.0.1:27017/chatapp_test_6';

mongoose.connect(uri);

export default mongoose;