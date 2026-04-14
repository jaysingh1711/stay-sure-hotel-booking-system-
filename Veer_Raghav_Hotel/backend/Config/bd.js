import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    let mongoUrl = process.env.MONGODB_URL;
    
    // Fallback to in-memory database if no URL is provided
    if (!mongoUrl) {
      console.log('No MONGODB_URL in .env. Starting in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUrl = mongoServer.getUri();
    }

    const conn = await mongoose.connect(mongoUrl, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

export default connectDB;