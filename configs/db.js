// configs/db.js
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const mongodbURI = process.env.MONGODB_URI;

    if (!mongodbURI) {
      throw new Error("❌ Missing MONGODB_URI in environment variables");
    }

    console.log("⏳ Connecting to MongoDB...");

    const conn = await mongoose.connect(mongodbURI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5,
      family: 4,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected to: ${conn.connection.host}`);
  } catch (error) {
    console.error("🚨 MongoDB Connection Error:", error.message);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
