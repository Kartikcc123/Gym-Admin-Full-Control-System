import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Make sure it is .connect() and not .createconnect()
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;