import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './Models/Room.js';

dotenv.config();

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for fixing images.");

    const db = mongoose.connection.db;
    const defaultImages = [
      "1734937392156-room3.jpeg",
      "1734944825145-room1.jpeg"
    ];

    // Using native collection updateMany to bypass schema validation
    const result = await db.collection('rooms').updateMany(
      { $or: [ { images: { $exists: false } }, { images: { $size: 0 } } ] },
      { $set: { images: defaultImages } }
    );
    
    console.log(`Updated ${result.modifiedCount} rooms with default images.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixImages();
